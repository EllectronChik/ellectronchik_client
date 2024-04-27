'use server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export default async function generateHash(password: string) {
  const firstHash = crypto.createHash('sha256').update(password).digest('hex');

  const updatedInput = `${firstHash}${password}${process.env.SECRET}`;

  const secondHash = crypto
    .createHash('sha256')
    .update(updatedInput)
    .digest('hex');
  
  cookies().set('key', `${secondHash}`);
  
  return secondHash;
}