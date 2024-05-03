"use server";
import crypto from "crypto";
import { cookies } from "next/headers";

export default async function encryptText(
  title: string,
  text: string
) {
  const secret = cookies().get("key")?.value || '';
  const iv = crypto.randomBytes(16);
  const cipherTitle = crypto.createCipheriv("aes-256-cbc", secret, iv);
  const cipherText = crypto.createCipheriv("aes-256-cbc", secret, iv);
  const encryptedTitle = Buffer.concat([cipherTitle.update(title), cipherTitle.final()]);
  const encryptedText = Buffer.concat([cipherText.update(text), cipherText.final()]);

  return {
    title: encryptedTitle.toString("hex"),
    text: encryptedText.toString("hex"),
    iv: iv.toString("hex"),
  };
}
