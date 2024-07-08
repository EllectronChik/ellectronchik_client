"use client";

export default async function setCookie(
  name: string,
  value: string,
  lifetime?: number,
  path?: string,
  httpOnly?: boolean,
  secure?: boolean,
  sameSite?: "lax" | "none" | "strict"
) {
  if (typeof document === "undefined") {
    return false;
  }

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (lifetime) {
    const expires = new Date(Date.now() + lifetime * 1000).toUTCString();
    cookieString += `; expires=${expires}`;
  }

  cookieString += `; path=${path || "/"}`;

  if (httpOnly) {
    cookieString += "; httpOnly";
  }

  if (secure) {
    cookieString += "; secure";
  }

  if (sameSite) {
    cookieString += `; sameSite=${sameSite}`;
  }

  try {
    document.cookie = cookieString;
  } catch (e) {
    return false;
  }

  return true;
}
