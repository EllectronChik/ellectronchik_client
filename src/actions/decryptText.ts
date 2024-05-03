"use server";

import crypto from "crypto";
import { cookies } from "next/headers";

export default async function decryptText(
  title: string,
  text: string,
  iv: string
) {
  const secret = cookies().get("key")?.value || '';
  const dechiperTitle = crypto.createDecipheriv(
    "aes-256-cbc",
    secret,
    Buffer.from(iv, "hex")
  );
  const dechiperText = crypto.createDecipheriv(
    "aes-256-cbc",
    secret,
    Buffer.from(iv, "hex")
  );
  const decryptedTitle = Buffer.concat([
    dechiperTitle.update(Buffer.from(title, "hex")),
    dechiperTitle.final(),
  ]);
  const decryptedText = Buffer.concat([
    dechiperText.update(Buffer.from(text, "hex")),
    dechiperText.final(),
  ]);
  return {
    title: decryptedTitle.toString(),
    text: decryptedText.toString(),
  };
}
