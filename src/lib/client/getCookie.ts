"use client";

export default async function getCookie(value: string) {
  if (typeof document === "undefined") {
    return undefined;
  }

  const cookie = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${value}=`));
  return cookie ? cookie.split("=")[1] : undefined;
}
