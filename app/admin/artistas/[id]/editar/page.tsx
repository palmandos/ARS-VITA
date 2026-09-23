import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateArtistAction } from "@/app/actions/admin";

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const artist = await prisma.artist.findUnique({
    where: { id },
  });

  if (!artist) {
    notFound();
  }

  return (
    <main className="admin-shell narrow-admin">
      <Link href="/admin" className="admin-back">
        ← Volver al administrador
      </Link>

      <div className="artist-edit-heading">
        <img
          src={artist.image}
          alt={artist.name}
        />

        <div>
          <p className="eyebrow">Artista</p>
          <h1>{artist.name}</h1>
        </div>
      </div>

      <form
        action={updateArtistAction}
        className="admin-form admin-form-grid"
      >
        <input
          type="hidden"
          name="id"
          value={artist.id}
        />

        <label>
          Nombre
          <input
            name="name"
            defaultValue={artist.name}
            required
          />
        </label>

        <label>
  Foto actual
  <input
    name="image"
    defaultValue={artist.image}
    placeholder="/artists/nombre-artista.jpg"
  />
</label>

<label>
  Cambiar foto
  <input
    type="file"
    name="imageFile"
    accept="image/*"
  />
</label>

        <label className="full">
          Descripción corta
          <textarea
            name="shortBio"
            rows={4}
            defaultValue={artist.shortBio || ""}
            placeholder="Breve presentación del artista para mostrar en la página principal."
          />
        </label>

        <label className="full">
          Biografía
          <textarea
            name="bio"
            rows={14}
            defaultValue={artist.bio}
            placeholder="Trayectoria, formación, enfoque artístico, exposiciones..."
            required
          />
        </label>

        <label>
          Instagram
          <input
            name="instagram"
            defaultValue={artist.instagram || ""}
            placeholder="@usuario o https://instagram.com/usuario"
          />
        </label>

        <label>
          Sitio web
          <input
            name="website"
            defaultValue={artist.website || ""}
            placeholder="https://..."
          />
        </label>

        <div className="full">
          <button
            className="button primary"
            type="submit"
          >
            Guardar perfil
          </button>
        </div>
      </form>
    </main>
  );
}
