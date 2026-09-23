import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = await prisma.artist.findUnique({ where: { slug }, include: { artworks: { where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] } } });
  if (!artist) notFound();
  return (
    <main>
      <header className="site-header"><Link className="wordmark" href="/"><span>ARS VITA</span><small>Creadores contemporáneos</small></Link><nav><Link href="/">Inicio</Link><Link href="/#artistas">Artistas</Link><Link href="/obras">Obras</Link><Link href="/#contacto">Contacto</Link></nav></header>
      <section className="artist-profile-hero">
        <div className="artist-profile-photo"><img src={artist.image} alt={artist.name} /></div>
        <div><p className="eyebrow">Artista · Ars Vita</p><h1>{artist.name}</h1><p className="artist-profile-bio">{artist.bio}</p>{artist.instagram && <a className="instagram-link" href={artist.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>}</div>
      </section>
      <section className="artist-works-section"><div className="section-head"><div><p className="eyebrow">Obras</p><h2>Selección de obras.</h2></div></div>{artist.artworks.length ? <div className="public-work-grid">{artist.artworks.map(work => <article className="public-work-card" key={work.id}><img src={work.imageUrl} alt={work.title} /><div><h3>{work.title}</h3><p>{[work.technique, work.dimensions, work.year].filter(Boolean).join(" · ")}</p>{work.description && <p className="work-description">{work.description}</p>}</div></article>)}</div> : <p className="gallery-empty">Todavía no hay obras publicadas de este artista.</p>}</section>
      <footer><div className="footer-wordmark">ARS VITA <span>Creadores contemporáneos</span></div><p>Montevideo, Uruguay</p><p>El arte es nuestra vida.</p></footer>
    </main>
  );
}
