import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateArtistAction } from "@/app/actions/admin";

export default async function EditArtistPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const artist = await prisma.artist.findUnique({ where: { id } });
  if (!artist) notFound();
  return (
    <main className="admin-shell narrow-admin">
      <Link href="/admin" className="admin-back">← Volver al administrador</Link>
      <div className="artist-edit-heading"><img src={artist.image} alt={artist.name} /><div><p className="eyebrow">Artista</p><h1>{artist.name}</h1></div></div>
      <form action={updateArtistAction} className="admin-form">
        <input type="hidden" name="id" value={artist.id} />
        <label>Biografía<textarea name="bio" rows={12} defaultValue={artist.bio} required /></label>
        <label>Instagram<input name="instagram" defaultValue={artist.instagram || ""} placeholder="@usuario o https://instagram.com/usuario" /></label>
        <button className="button primary" type="submit">Guardar perfil</button>
      </form>
    </main>
  );
}
