import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function Arrow() { return <span aria-hidden="true">→</span>; }

export default async function Home() {
  const [artists, artworks] = await Promise.all([
    prisma.artist.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.artwork.findMany({ where: { isPublished: true }, include: { artist: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 6 }),
  ]);

  return (
    <main>
      <header className="site-header">
        <Link className="wordmark" href="/#inicio" aria-label="ARS VITA, inicio"><span>ARS VITA</span><small>Creadores contemporáneos</small></Link>
        <nav aria-label="Navegación principal">
          <Link href="/#inicio">Inicio</Link><Link href="/#artistas">Artistas</Link><Link href="/obras">Obras</Link><Link href="/#exposiciones">Exposiciones</Link><Link href="/#ars-vita">Ars Vita</Link><Link href="/#contacto">Contacto</Link>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-mark" aria-hidden="true"><img src="/brand/ars-vita-logo.png" alt="" /></div>
        <div className="hero-copy">
          <p className="eyebrow">Galería digital · Montevideo, Uruguay</p>
          <h1>Una galería digital para descubrir artistas, obras y exposiciones.</h1>
          <p className="lead">Ocho artistas, ocho miradas y un mismo horizonte: el arte como forma de vida.</p>
          <div className="actions"><a className="button primary" href="#artistas">Explorar artistas <Arrow /></a><a className="button secondary" href="#ars-vita">Conocer Ars Vita</a></div>
        </div>
      </section>

      <section className="about" id="ars-vita">
        <div><p className="eyebrow">Ars Vita</p><h2>El arte es nuestra vida.</h2></div>
        <div className="about-text">
          <p><strong>ARS VITA</strong> nace de una convicción esencial: el arte no solo acompaña nuestras vidas; <strong>es una forma de vivirlas.</strong></p>
          <p>El nombre reinterpreta la expresión <em>Ars longa, vita brevis</em> —«el arte es largo, la vida es breve»— para afirmar: <strong>ARS VITA, el arte es vida.</strong></p>
          <p>Somos ocho artistas que, desde experiencias y caminos propios, encontramos en el arte un lenguaje vital. Cada uno ha desarrollado su propia mirada, su propio recorrido, explorando, creando y transformando la experiencia en imagen, forma, color, materia o gesto.</p>
          <p>Nuestros lenguajes son diversos; no buscamos una estética compartida, sino la fuerza de una búsqueda sostenida en el tiempo.</p>
          <p className="about-signoff">ARS VITA afirma que el arte no solo forma parte de nuestra existencia: la construye.</p>
        </div>
      </section>

      <section className="artists-section" id="artistas">
        <div className="section-head"><div><p className="eyebrow">Nuestros artistas</p><h2>Ocho miradas, infinitas posibilidades.</h2></div><p>Distintas trayectorias, técnicas y lenguajes reunidos por una misma dedicación al arte.</p></div>
        <div className="artists-grid">
          {artists.map((artist) => (
            <article className="artist-card" key={artist.id}>
              <img src={artist.image} alt={`Retrato de ${artist.name}`} />
              <div className="artist-content"><h3>{artist.name}</h3><p>{artist.bio}</p><Link href={`/artistas/${artist.slug}`}>Ver perfil y obras <Arrow /></Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="works" id="obras">
        <div className="works-copy"><p className="eyebrow">Obras</p><h2>{artworks.length ? "Una selección de la galería." : "La colección está comenzando."}</h2><p>{artworks.length ? "Una mirada a algunas de las obras que integran el universo de Ars Vita." : "Desde el administrador se pueden cargar las primeras obras y publicarlas cuando estén listas."}</p><Link className="button secondary" href="/obras">Ver todas las obras <Arrow /></Link></div>
        {artworks.length ? <div className="home-work-grid">{artworks.slice(0, 4).map(work => <Link href={`/artistas/${work.artist.slug}`} key={work.id} className="home-work"><img src={work.imageUrl} alt={work.title} /><span>{work.title}<small>{work.artist.name}</small></span></Link>)}</div> : <div className="work-composition" aria-hidden="true"><div className="work-panel panel-a" /><div className="work-panel panel-b" /><div className="work-panel panel-c" /></div>}
      </section>

      <section className="exhibitions" id="exposiciones"><p className="eyebrow">Exposiciones</p><div className="exhibition-row"><h2>Un espacio para registrar el recorrido de Ars Vita.</h2><p>Las exposiciones podrán tener su propia página con sede, fecha, texto curatorial, fotografías y artistas participantes. Así la web funciona también como archivo del colectivo.</p></div></section>

      <section className="contact" id="contacto"><div><p className="eyebrow">Contacto</p><h2>Arte que transforma. Ideas que perduran.</h2></div><div className="contact-card"><p>Para exposiciones, prensa, colaboraciones o consultas sobre las obras.</p><a className="button primary" href="mailto:contacto@arsvita.uy">contacto@arsvita.uy <Arrow /></a><small>El correo se puede reemplazar antes de publicar.</small></div></section>
      <footer><div className="footer-wordmark">ARS VITA <span>Creadores contemporáneos</span></div><p>Montevideo, Uruguay</p><p>El arte es nuestra vida.</p></footer>
    </main>
  );
}
