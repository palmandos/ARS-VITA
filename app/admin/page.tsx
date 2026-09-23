import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteArtworkAction, logoutAction } from "@/app/actions/admin";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireAdmin();
  const [artists, artworks] = await Promise.all([
    prisma.artist.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.artwork.findMany({ include: { artist: true }, orderBy: [{ createdAt: "desc" }] }),
  ]);
  const params = await searchParams;
  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div><p className="eyebrow">ARS VITA</p><h1>Administrador</h1></div>
        <div className="admin-top-actions"><Link href="/" className="button secondary">Ver sitio</Link><form action={logoutAction}><button className="button secondary">Salir</button></form></div>
      </header>
      {params.ok && <p className="admin-success">Cambios guardados correctamente.</p>}

      <section className="admin-panel">
        <div className="admin-panel-head"><div><p className="eyebrow">Obras</p><h2>Galería</h2></div><Link className="button primary" href="/admin/obras/nueva">+ Agregar obra</Link></div>
        {artworks.length === 0 ? <p className="admin-empty">Todavía no hay obras cargadas.</p> : (
          <div className="admin-work-list">
            {artworks.map((work) => (
              <article className="admin-work-row" key={work.id}>
                <img src={work.imageUrl} alt="" />
                <div><strong>{work.title}</strong><span>{work.artist.name}</span><small>{work.isPublished ? "Visible en la web" : "Oculta"}</small></div>
                <div className="admin-row-actions"><Link href={`/admin/obras/${work.id}/editar`}>Editar</Link><form action={deleteArtworkAction}><input type="hidden" name="id" value={work.id} /><button type="submit">Eliminar</button></form></div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-head"><div><p className="eyebrow">Artistas</p><h2>Biografías e Instagram</h2></div></div>
        <div className="admin-artists-grid">
          {artists.map((artist) => (
            <article className="admin-artist-card" key={artist.id}>
              <img src={artist.image} alt={artist.name} />
              <div><h3>{artist.name}</h3><p>{artist.bio}</p><small>{artist.instagram ? "Instagram configurado" : "Instagram pendiente"}</small><Link href={`/admin/artistas/${artist.id}/editar`}>Editar perfil →</Link></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
