import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ObrasPage() {
  const works = await prisma.artwork.findMany({ where: { isPublished: true }, include: { artist: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <main>
      <header className="site-header"><Link className="wordmark" href="/"><span>ARS VITA</span><small>Creadores contemporáneos</small></Link><nav><Link href="/">Inicio</Link><Link href="/#artistas">Artistas</Link><Link href="/obras">Obras</Link><Link href="/#contacto">Contacto</Link></nav></header>
      <section className="gallery-page-head"><p className="eyebrow">Galería</p><h1>Obras</h1><p>Una selección de obras de los artistas que integran Ars Vita.</p></section>
      <section className="artist-works-section">{works.length ? <div className="public-work-grid">{works.map(work => <article className="public-work-card" key={work.id}><Link href={`/artistas/${work.artist.slug}`}><img src={work.imageUrl} alt={work.title} /></Link><div><h3>{work.title}</h3><p><Link href={`/artistas/${work.artist.slug}`}>{work.artist.name}</Link>{[work.technique, work.dimensions, work.year].filter(Boolean).length ? ` · ${[work.technique, work.dimensions, work.year].filter(Boolean).join(" · ")}` : ""}</p>{work.description && <p className="work-description">{work.description}</p>}</div></article>)}</div> : <p className="gallery-empty">La galería todavía no tiene obras publicadas.</p>}</section>
      <footer><div className="footer-wordmark">ARS VITA <span>Creadores contemporáneos</span></div><p>Montevideo, Uruguay</p><p>El arte es nuestra vida.</p></footer>
    </main>
  );
}
