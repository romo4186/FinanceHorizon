import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

// Helper to create directory recursively if it doesn't exist
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return new NextResponse('Missing image URL', { status: 400 });
    }

    // Width and quality parsing
    const widthParam = searchParams.get('w');
    const width = widthParam ? parseInt(widthParam, 10) : 800;
    
    const qualityParam = searchParams.get('q');
    // Enforce maximum 50% quality ceiling for Core Web Vitals Lighthouse optimization
    let quality = qualityParam ? parseInt(qualityParam, 10) : 50;
    if (quality > 50) quality = 50;

    // Negotiate image format using Accept header
    const acceptHeader = request.headers.get('accept') || '';
    let format: 'avif' | 'webp' | 'png' | 'jpeg' = 'jpeg';
    let contentType = 'image/jpeg';

    if (acceptHeader.includes('image/avif')) {
      format = 'avif';
      contentType = 'image/avif';
    } else if (acceptHeader.includes('image/webp')) {
      format = 'webp';
      contentType = 'image/webp';
    } else if (imageUrl.toLowerCase().endsWith('.png')) {
      format = 'png';
      contentType = 'image/png';
    }

    // SVG files should be served untouched
    if (imageUrl.toLowerCase().endsWith('.svg') || imageUrl.toLowerCase().includes('.svg?')) {
      if (!imageUrl.startsWith('http')) {
        const localPath = path.join(process.cwd(), 'public', imageUrl);
        if (fs.existsSync(localPath)) {
          const svgBuffer = await fs.promises.readFile(localPath);
          return new NextResponse(new Uint8Array(svgBuffer), {
            headers: {
              'Content-Type': 'image/svg+xml',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      } else {
        const res = await fetch(imageUrl);
        const svgBuffer = await res.arrayBuffer();
        return new NextResponse(new Uint8Array(svgBuffer), {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    // Caching configuration
    const cacheDir = path.join(process.cwd(), 'public', 'images', '.cache');
    ensureDirectoryExists(cacheDir);

    const cacheKey = crypto
      .createHash('md5')
      .update(`${imageUrl}_w${width}_q${quality}_f${format}`)
      .digest('hex');

    const cacheFilePath = path.join(cacheDir, `${cacheKey}.${format}`);
    
    // Check local filesystem cache
    if (fs.existsSync(cacheFilePath)) {
      const cachedImage = await fs.promises.readFile(cacheFilePath);
      return new NextResponse(new Uint8Array(cachedImage), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Fetch original image buffer
    let imageBuffer: Buffer;
    if (imageUrl.startsWith('http')) {
      const response = await fetch(imageUrl, {
        next: { revalidate: 86400 }, // Cache original response for 24h
        headers: {
          'User-Agent': 'Finance Horizon Image Optimizer (Sharp)',
        },
      });

      if (!response.ok) {
        return new NextResponse('Failed to fetch source image', { status: response.status });
      }
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      // Local file
      const localPath = path.join(process.cwd(), 'public', imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`);
      if (!fs.existsSync(localPath)) {
        return new NextResponse(`Local image not found: ${localPath}`, { status: 404 });
      }
      imageBuffer = await fs.promises.readFile(localPath);
    }

    // Optimize with Sharp
    const sharpInstance = sharp(imageBuffer);
    const metadata = await sharpInstance.metadata();

    // Only resize if requested width is smaller than original
    if (metadata.width && metadata.width > width) {
      sharpInstance.resize({ width, withoutEnlargement: true });
    }

    // Format-specific conversions
    if (format === 'avif') {
      sharpInstance.avif({ quality, effort: 4 });
    } else if (format === 'webp') {
      sharpInstance.webp({ quality, effort: 6, smartSubsample: true });
    } else if (format === 'png') {
      sharpInstance.png({ quality, progressive: true });
    } else {
      sharpInstance.jpeg({ quality, progressive: true });
    }

    const optimizedBuffer = await sharpInstance.toBuffer();

    // Atomic cache write to prevent concurrency file collision
    const tempFilePath = path.join(cacheDir, `${cacheKey}.tmp`);
    await fs.promises.writeFile(tempFilePath, optimizedBuffer);
    await fs.promises.rename(tempFilePath, cacheFilePath);

    return new NextResponse(new Uint8Array(optimizedBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Image optimization error:', error);
    return new NextResponse('Internal Image Optimization Error', { status: 500 });
  }
}
