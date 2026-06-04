import { getAdminSession } from '@/app/actions/admin';
import { prisma } from '@/lib/prisma';
import PortalClient from './PortalClient';

export const dynamic = 'force-dynamic';

export default async function PortalPage() {
  const session = await getAdminSession();
  const isLoggedIn = !!(session && session.admin);

  let articles: any[] = [];
  if (isLoggedIn) {
    const dbArticles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
    // Serialize Dates to strings for safe passage to Client component
    articles = dbArticles.map((art) => ({
      ...art,
      createdAt: art.createdAt.toISOString(),
      updatedAt: art.updatedAt.toISOString(),
    }));
  }

  return <PortalClient isLoggedIn={isLoggedIn} initialArticles={articles} />;
}
