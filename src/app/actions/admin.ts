'use server';

import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { encryptSession, decryptSession, checkIpLockout, recordLoginFailure, recordLoginSuccess } from '@/lib/auth';

/**
 * Resolves the real client IP from trusted proxy headers.
 * Priority: cf-connecting-ip (Cloudflare) > x-real-ip (Nginx/Vercel) > x-forwarded-for first entry.
 */
function resolveClientIp(headersList: Awaited<ReturnType<typeof headers>>): string {
  return (
    headersList.get('cf-connecting-ip') ||
    headersList.get('x-real-ip') ||
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1'
  );
}

export async function adminLogin(password: string) {
  const headersList = await headers();
  const ip = resolveClientIp(headersList);

  // Check lockout status
  const lockoutStatus = await checkIpLockout(ip);
  if (lockoutStatus.locked) {
    const minutesLeft = Math.ceil((lockoutStatus.lockedUntil!.getTime() - Date.now()) / (1000 * 60));
    return { success: false, error: `Too many failed attempts. Try again in ${minutesLeft} minutes.` };
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('[adminLogin] ADMIN_PASSWORD environment variable is not set.');
    return { success: false, error: 'Server configuration error. Contact the administrator.' };
  }

  if (password !== adminPassword) {
    const result = await recordLoginFailure(ip);
    if (result.attempts >= 5) {
      return { success: false, error: 'Too many failed attempts. Locked out for 5 minutes.' };
    }
    return { success: false, error: `Invalid password. ${5 - result.attempts} attempts remaining.` };
  }

  // Clear failures on success
  await recordLoginSuccess(ip);

  // Generate JWT session
  const token = await encryptSession({ admin: true });
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });

  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return { success: true };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return await decryptSession(token);
}

export async function upsertArticle(formData: {
  id?: string;
  slug: string;
  category: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  authorSlug: string;
  createdAt?: string; // Manual override date
}) {
  const session = await getAdminSession();
  if (!session || !session.admin) {
    throw new Error('Unauthorized');
  }

  const {
    id,
    slug,
    category,
    title,
    metaTitle,
    metaDescription,
    excerpt,
    content,
    imageUrl,
    published,
    authorSlug,
    createdAt,
  } = formData;

  const data: any = {
    slug,
    category,
    title,
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
    excerpt,
    content,
    imageUrl: imageUrl || null,
    published,
    authorSlug,
  };

  // If a manual date is selected, override it
  if (createdAt) {
    data.createdAt = new Date(createdAt);
  }

  let updatedArticle;
  if (id) {
    updatedArticle = await prisma.article.update({
      where: { id },
      data,
    });
  } else {
    updatedArticle = await prisma.article.create({
      data,
    });
  }

  // Revalidate main pages to display changes instantly
  revalidatePath('/');
  revalidatePath('/eb-clinical-portal');
  revalidatePath(`/${category}`);
  revalidatePath(`/${category}/${slug}`);
  revalidatePath(`/search`);

  return { success: true, article: updatedArticle };
}

export async function deleteArticle(id: string) {
  const session = await getAdminSession();
  if (!session || !session.admin) {
    throw new Error('Unauthorized');
  }

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    return { success: false, error: 'Article not found' };
  }

  await prisma.article.delete({
    where: { id },
  });

  // Revalidate pages
  revalidatePath('/');
  revalidatePath('/eb-clinical-portal');
  if (article.category) {
    revalidatePath(`/${article.category}`);
    revalidatePath(`/${article.category}/${article.slug}`);
  }
  revalidatePath(`/search`);

  return { success: true };
}

