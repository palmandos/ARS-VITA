import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const artists = [
  {
    name: "Jorge Almandos",
    slug: "jorge-almandos",
    image: "/artists/jorge-almandos.jpg",
    bio: "Explora la abstracción geométrica a partir de una construcción racional, en la que forma, línea, color y espacio se relacionan en equilibrio. Mediante el uso de proporciones y medidas áureas, investiga la profundidad, el ritmo y la armonía, buscando generar una emoción estética que surja de la propia esencia de la pintura.",
  },
  {
    name: "Raúl Penino",
    slug: "raul-penino",
    image: "/artists/raul-penino.jpg",
    bio: "Su obra explora la geometría, el ritmo y la repetición como elementos centrales de la composición. A través de estructuras cuidadosamente organizadas, construye imágenes donde las formas dialogan entre sí y generan una marcada sensación de orden y movimiento. El color, utilizado con equilibrio y sensibilidad, establece contrastes y armonías que acompañan la estructura de la obra.",
  },
  {
    name: "Daniel Esponda",
    slug: "daniel-esponda",
    image: "/artists/daniel-esponda.jpg",
    bio: "Investiga la relación entre el cuerpo, la naturaleza y lo espiritual. Sus obras, cargadas de simbolismo, se mueven entre lo figurativo y lo abstracto, explorando estados interiores y territorios emocionales. El detalle y la textura son parte esencial de su búsqueda expresiva.",
  },
  {
    name: "Mario Presa",
    slug: "mario-presa",
    image: "/artists/mario-presa.jpg",
    bio: "Su trabajo se caracteriza por una fuerte expresividad y una gestualidad enérgica. A través de manchas, trazos y transparencias construye superficies vibrantes donde el color y la materia son protagonistas. Sus obras transmiten movimiento, intensidad y emoción, proponiendo una experiencia sensible y directa.",
  },
  {
    name: "Jorge Sosa",
    slug: "jorge-sosa",
    image: "/artists/jorge-sosa.jpg",
    bio: "Todos nos preguntamos alguna vez ¿Qué es ser artista? Es captar al Universo de colores, formas, sonidos y movimientos, agregarle nuestro Ser y preparar todo para que llegue intensamente a otro, que lo está esperando.",
  },
  {
    name: "Pedro Meriles",
    slug: "pedro-meriles",
    image: "/artists/pedro-meriles.jpg",
    bio: "Su obra se inscribe en una búsqueda de raíz constructiva, vinculada a la tradición de la pintura uruguaya. Trabaja a partir de formas geométricas y planos de color, organizando la composición mediante relaciones de equilibrio, superposición y contraste. El color es protagonista: los tonos se enfrentan, dialogan y generan tensiones que dinamizan la obra.",
  },
  {
    name: "Roberto González",
    slug: "roberto-gonzalez",
    image: "/artists/roberto-gonzalez.jpg",
    bio: "Su obra se distingue por la búsqueda incansable de formas imposibles. Comienza generando caos con enmarañadas líneas ininterrumpidas que analiza, selecciona y compone, convirtiendo el resultado en topografías iluminadas y coloreadas con extrema minuciosidad.",
  },
  {
    name: "Gastón Beltrán",
    slug: "gaston-beltran",
    image: "/artists/gaston-beltran.jpg",
    bio: "Su trabajo parte del dibujo y la gráfica aplicados sobre tela mediante la técnica del pirograbado. A través del fuego sobre la superficie, construye líneas, tramas y texturas que generan imágenes de gran fuerza visual y riqueza de detalle. El contraste entre el gesto, el material y la precisión del trazo da lugar a obras únicas.",
  },
];

async function main() {
  for (const [index, artist] of artists.entries()) {
    await prisma.artist.upsert({
      where: { slug: artist.slug },
      update: {},
      create: { ...artist, sortOrder: index },
    });
  }
}

main().finally(() => prisma.$disconnect());
