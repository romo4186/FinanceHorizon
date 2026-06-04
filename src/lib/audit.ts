import { headers } from 'next/headers';
import { prisma } from './prisma';

export async function logTraffic() {
  try {
    const headersList = await headers();
    const url = headersList.get('x-url') || '/';
    const method = headersList.get('x-method') || 'GET';
    const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() || null;
    const userAgent = headersList.get('user-agent');
    const referer = headersList.get('referer');

    // Build standard JSON object of all headers for audit compliance
    const headersObj: Record<string, string> = {};
    headersList.forEach((value, key) => {
      // Don't store large cookie data to save DB space and protect session details
      if (key.toLowerCase() !== 'cookie') {
        headersObj[key] = value;
      }
    });

    await prisma.trafficLog.create({
      data: {
        method,
        url,
        ip,
        userAgent,
        referer,
        headers: headersObj,
      },
    });
  } catch (error: any) {
    if (
      error?.message?.includes('Dynamic server usage') ||
      error?.digest === 'DYNAMIC_SERVER_USAGE' ||
      error?.name === 'DynamicServerError'
    ) {
      // Quietly ignore static pre-rendering checks during npm run build
      return;
    }
    console.error('Failed to write traffic log to PostgreSQL:', error);
  }
}
