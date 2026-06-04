interface LoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function customImageLoader({ src, width, quality }: LoaderProps) {
  // SVG files are vector graphics and should bypass optimization
  if (src.endsWith('.svg')) {
    return src;
  }

  // Route request to our dynamic Sharp image optimizer API
  return `/api/images?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 50}`;
}
