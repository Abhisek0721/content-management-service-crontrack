import { randomBytes } from 'crypto';

export function generateCryptoToken(length: number): string {
  return randomBytes(length).toString('hex');
}

