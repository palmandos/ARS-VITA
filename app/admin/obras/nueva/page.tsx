import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createArtworkAction } from "@/app/actions/admin";

export default async function NewArtworkPage() {
  await requireAdmin();
  const artists = await prisma.artist.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <main className="admin-shell narrow-admin">
      <Link href="/admin" className="admin-back">← Volver al administrador</Link>
      <p className="eyebrow">Obras</p><h1>Nueva obra</h1>
      <form action={createArtworkAction} className="admin-form admin-form-grid">
        <label>Título<input name="title" required /></label>
        <label>Artista<select name="artistId" required defaultValue=""><option value="" disabled>Seleccionar</option>{artists.map(a => <option value={a.id} key={a.id}>{a.name}</option>)}</select></label>
        <label>Técnica<input name="technique" placeholder="Óleo sobre tela" /></label>
        <label>Medidas<input name="dimensions" placeholder="80 × 60 cm" /></label>
        <label>Año<input name="year" type="number" min="1800" max="2100" /></label>
        <label className="full">Descripción<textarea name="description" rows={5} /></label>
        <label className="full">Subir imagen<input name="image" type="file" accept="image/*" /></label>
        <label className="full">o usar URL de imagen<input name="imageUrl" type="url" placeholder="https://..." /></label>
        <label className="check full"><input name="isPublished" type="checkbox" defaultChecked /> Mostrar la obra en la web</label>
        <div className="full"><button className="button primary" type="submit">Guardar obra</button></div>
      </form>
    </main>
  );
}
