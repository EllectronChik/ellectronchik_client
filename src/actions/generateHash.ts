'use server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export default async function generateHash(password: string) {
  const firstHash = crypto.createHash('sha256').update(password).digest('hex');

  const updatedInput = `${firstHash}${password}${process.env.SECRET}`;

  const secondHash = crypto
    .createHash('md5')
    .update(updatedInput)
    .digest('hex');
  
  cookies().set('key', `${secondHash}`, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  
  return secondHash;
}