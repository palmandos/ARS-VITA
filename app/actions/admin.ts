"use server";

import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearAdminSession, passwordIsValid, requireAdmin, setAdminSession } from "@/lib/auth";

function str(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeInstagram(value: string) {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const handle = value.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}

async function uploadImage(file: File | null, fallback?: string) {
  if (!file || file.size === 0) return fallback || "";
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Falta configurar BLOB_READ_WRITE_TOKEN en Vercel para subir imágenes.");
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const blob = await put(`ars-vita/${Date.now()}-${safeName}`, file, { access: "public" });
  return blob.url;
}

export async function loginAction(formData: FormData) {
  const password = str(formData.get("password"));
  if (!passwordIsValid(password)) redirect("/admin/login?error=1");
  await setAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateArtistAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  const bio = str(formData.get("bio"));
  const instagram = normalizeInstagram(str(formData.get("instagram")));
  if (!id || !bio) throw new Error("La biografía no puede quedar vacía.");
  await prisma.artist.update({ where: { id }, data: { bio, instagram } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/artistas", "layout");
  redirect("/admin?ok=artista");
}

export async function createArtworkAction(formData: FormData) {
  await requireAdmin();
  const title = str(formData.get("title"));
  const artistId = str(formData.get("artistId"));
  const imageUrlInput = str(formData.get("imageUrl"));
  const file = formData.get("image") instanceof File ? (formData.get("image") as File) : null;
  const imageUrl = await uploadImage(file, imageUrlInput);
  if (!title || !artistId || !imageUrl) throw new Error("Título, artista e imagen son obligatorios.");

  const yearRaw = str(formData.get("year"));
  const year = yearRaw ? Number(yearRaw) : null;
  await prisma.artwork.create({
    data: {
      title,
      artistId,
      imageUrl,
      technique: str(formData.get("technique")) || null,
      dimensions: str(formData.get("dimensions")) || null,
      year: Number.isFinite(year) ? year : null,
      description: str(formData.get("description")) || null,
      isPublished: formData.get("isPublished") === "on",
    },
  });
  revalidatePath("/");
  revalidatePath("/obras");
  revalidatePath("/admin");
  redirect("/admin?ok=obra");
}

export async function updateArtworkAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  const current = await prisma.artwork.findUnique({ where: { id } });
  if (!current) throw new Error("No se encontró la obra.");
  const file = formData.get("image") instanceof File ? (formData.get("image") as File) : null;
  const imageUrlInput = str(formData.get("imageUrl"));
  const imageUrl = await uploadImage(file, imageUrlInput || current.imageUrl);
  if (file && file.size > 0 && current.imageUrl.includes("blob.vercel-storage.com")) {
    try { await del(current.imageUrl); } catch { /* no bloquear la edición */ }
  }
  const yearRaw = str(formData.get("year"));
  const year = yearRaw ? Number(yearRaw) : null;
  await prisma.artwork.update({
    where: { id },
    data: {
      title: str(formData.get("title")),
      artistId: str(formData.get("artistId")),
      imageUrl,
      technique: str(formData.get("technique")) || null,
      dimensions: str(formData.get("dimensions")) || null,
      year: Number.isFinite(year) ? year : null,
      description: str(formData.get("description")) || null,
      isPublished: formData.get("isPublished") === "on",
    },
  });
  revalidatePath("/");
  revalidatePath("/obras");
  revalidatePath("/admin");
  redirect("/admin?ok=obra-editada");
}

export async function deleteArtworkAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  const work = await prisma.artwork.findUnique({ where: { id } });
  if (!work) redirect("/admin");
  await prisma.artwork.delete({ where: { id } });
  if (work.imageUrl.includes("blob.vercel-storage.com")) {
    try { await del(work.imageUrl); } catch { /* no bloquear el borrado */ }
  }
  revalidatePath("/");
  revalidatePath("/obras");
  revalidatePath("/admin");
  redirect("/admin?ok=obra-eliminada");
}
