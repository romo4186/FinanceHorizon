import * as jose from 'jose';
import { prisma } from './prisma';

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'fallback-secret-for-development-only-replace-immediately'
);

export async function encryptSession(payload: { admin: boolean }) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function decryptSession(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    return payload as { admin: boolean };
  } catch (e) {
    return null;
  }
}

/**
 * Checks if the client IP is currently locked out.
 * If the lockout period has expired, it resets the failure attempts.
 */
export async function checkIpLockout(ip: string): Promise<{ locked: boolean; lockedUntil: Date | null }> {
  const log = await prisma.securityLog.findUnique({
    where: { ip },
  });

  if (!log) {
    return { locked: false, lockedUntil: null };
  }

  if (log.isLocked && log.lockedUntil) {
    const now = new Date();
    if (now < log.lockedUntil) {
      return { locked: true, lockedUntil: log.lockedUntil };
    } else {
      // Lockout expired, reset log
      await prisma.securityLog.update({
        where: { ip },
        data: {
          attempts: 0,
          isLocked: false,
          lockedUntil: null,
        },
      });
      return { locked: false, lockedUntil: null };
    }
  }

  return { locked: false, lockedUntil: null };
}

/**
 * Records a login failure for the client IP.
 * Increments attempt count and locks IP if threshold (5 attempts) is reached.
 */
export async function recordLoginFailure(ip: string): Promise<{ attempts: number; lockedUntil: Date | null }> {
  const log = await prisma.securityLog.findUnique({
    where: { ip },
  });

  const now = new Date();
  if (!log) {
    const newLog = await prisma.securityLog.create({
      data: {
        ip,
        attempts: 1,
        lastAttempt: now,
      },
    });
    return { attempts: 1, lockedUntil: null };
  }

  const newAttempts = log.attempts + 1;
  let isLocked = false;
  let lockedUntil: Date | null = null;

  if (newAttempts >= 5) {
    isLocked = true;
    lockedUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes lockout
  }

  await prisma.securityLog.update({
    where: { ip },
    data: {
      attempts: newAttempts,
      lastAttempt: now,
      isLocked,
      lockedUntil,
    },
  });

  return { attempts: newAttempts, lockedUntil };
}

/**
 * Resets the security logs for a client IP on successful login.
 */
export async function recordLoginSuccess(ip: string): Promise<void> {
  await prisma.securityLog.upsert({
    where: { ip },
    update: {
      attempts: 0,
      isLocked: false,
      lockedUntil: null,
    },
    create: {
      ip,
      attempts: 0,
      isLocked: false,
      lockedUntil: null,
    },
  });
}
