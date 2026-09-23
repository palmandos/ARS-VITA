import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "arsvita_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function signature(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function passwordIsValid(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || expected.length < 8) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function setAdminSession() {
  const store = await cookies();
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin:${expires}`;
  store.set(COOKIE_NAME, `${payload}.${signature(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdmin() {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value || !secret()) return false;
  const dot = value.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = value.slice(0, dot);
  const supplied = value.slice(dot + 1);
  const expected = signature(payload);
  if (supplied.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return false;
  const [, expiry] = payload.split(":");
  return Number(expiry) > Math.floor(Date.now() / 1000);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
