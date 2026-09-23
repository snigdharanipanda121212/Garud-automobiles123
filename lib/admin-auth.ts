import crypto from 'crypto';
import { NextRequest } from 'next/server';

const AUTH_SECRET = process.env.ADMIN_SESSION_SECRET || 'garud-automobiles-secure-key-ganjam-2026';

export function createAdminToken(username: string): string {
  // Valid for 7 days
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${username}:${expires}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;

    const [username, expiresStr, signature] = parts;
    if (!username || !expiresStr || !signature) return false;

    const expires = parseInt(expiresStr, 10);
    if (isNaN(expires) || Date.now() > expires) return false;

    const payload = `${username}:${expires}`;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedSig, 'hex');
    if (sigBuf.length !== expBuf.length) return false;

    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export function verifyAdminRequest(req: NextRequest): boolean {
  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (verifyAdminToken(token)) return true;
  }

  // 2. Check custom header x-admin-token
  const customHeader = req.headers.get('x-admin-token');
  if (customHeader && verifyAdminToken(customHeader.trim())) {
    return true;
  }

  // 3. Check cookie garud_admin_session
  const cookie = req.cookies.get('garud_admin_session')?.value;
  if (cookie && verifyAdminToken(cookie)) {
    return true;
  }

  return false;
}
