"use server";
import crypto from "crypto";
import { cookies } from "next/headers";

export default async function encryptMedia(data: FormData) {
  const file = data.get("file") as File | null;
  const iv = data.get("iv") as string | null;
  if (!file || !iv) {
    return;
  }
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const secret = cookies().get("key")?.value || "";
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    secret,
    Buffer.from(iv, "hex")
  );
  const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
  const encryptedBlob = new Blob([encrypted], { type: file.type });

  return {
    file: Buffer.from(await encryptedBlob.arrayBuffer()).toString("hex"),
    name: file.name,
    mimeType: file.type,
  };
}
