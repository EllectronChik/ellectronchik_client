"use server";
import crypto from "crypto";
import { cookies } from "next/headers";

export default async function encryptText(
  title: string,
  text: string,
  iv: string
) {
  const ivBuffer = Buffer.from(iv, "hex");
  const secret = cookies().get("key")?.value || "";
  const cipherTitle = crypto.createCipheriv("aes-256-cbc", secret, ivBuffer);
  const cipherText = crypto.createCipheriv("aes-256-cbc", secret, ivBuffer);
  const encryptedTitle = Buffer.concat([
    cipherTitle.update(title),
    cipherTitle.final(),
  ]);
  const encryptedText = Buffer.concat([
    cipherText.update(text),
    cipherText.final(),
  ]);

  return {
    title: encryptedTitle.toString("hex"),
    text: encryptedText.toString("hex"),
  };
}
