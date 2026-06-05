import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { decryptSession } from '@/lib/auth';

/** Allowed image MIME types — explicit allowlist, not a denylist */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

/** Corresponding safe file extensions */
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

/** Maximum upload size: 10 MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: Request) {
  // ── 1. Authenticate: only admin sessions may upload ──────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const session = token ? await decryptSession(token) : null;
  if (!session?.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // ── 2. Validate MIME type against explicit allowlist ──────────────────
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed. Accepted: JPEG, PNG, WebP, GIF, AVIF.` },
        { status: 415 }
      );
    }

    // ── 3. Validate file size ─────────────────────────────────────────────
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds the 10 MB size limit.' },
        { status: 413 }
      );
    }

    // ── 4. Build a safe filename with an allowlisted extension ────────────
    const rawExt = path.extname(file.name).toLowerCase();
    const ext = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : '.jpg';
    const cleanBase = path.basename(file.name, rawExt)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 30);
    const uniqueFilename = `${Date.now()}-${cleanBase}${ext}`;

    // ── 5. Write to disk ──────────────────────────────────────────────────
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json({ success: true, url: `/uploads/${uniqueFilename}` });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 });
  }
}
