import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateArtworkAction } from "@/app/actions/admin";

export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [work, artists] = await Promise.all([
    prisma.artwork.findUnique({ where: { id } }),
    prisma.artist.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!work) notFound();
  return (
    <main className="admin-shell narrow-admin">
      <Link href="/admin" className="admin-back">← Volver al administrador</Link>
      <p className="eyebrow">Obras</p><h1>Editar obra</h1>
      <img className="edit-preview" src={work.imageUrl} alt={work.title} />
      <form action={updateArtworkAction} className="admin-form admin-form-grid">
        <input type="hidden" name="id" value={work.id} />
        <label>Título<input name="title" defaultValue={work.title} required /></label>
        <label>Artista<select name="artistId" defaultValue={work.artistId} required>{artists.map(a => <option value={a.id} key={a.id}>{a.name}</option>)}</select></label>
        <label>Técnica<input name="technique" defaultValue={work.technique || ""} /></label>
        <label>Medidas<input name="dimensions" defaultValue={work.dimensions || ""} /></label>
        <label>Año<input name="year" type="number" min="1800" max="2100" defaultValue={work.year || ""} /></label>
        <label className="full">Descripción<textarea name="description" rows={5} defaultValue={work.description || ""} /></label>
        <label className="full">Reemplazar imagen<input name="image" type="file" accept="image/*" /></label>
        <label className="full">URL de imagen<input name="imageUrl" type="url" defaultValue={work.imageUrl} /></label>
        <label className="check full"><input name="isPublished" type="checkbox" defaultChecked={work.isPublished} /> Mostrar la obra en la web</label>
        <div className="full"><button className="button primary" type="submit">Guardar cambios</button></div>
      </form>
    </main>
  );
}
