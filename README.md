# ARS VITA · Galería digital

Sitio web en Next.js preparado para GitHub + Vercel, con galería pública y administrador privado.

## Qué incluye

- Home pública con identidad visual de ARS VITA.
- Perfil individual para cada artista.
- Vínculo a Instagram en el perfil de cada artista.
- Galería general de obras.
- Administrador en `/admin`.
- Alta, edición, publicación/ocultamiento y borrado de obras.
- Edición de biografías e Instagram de los artistas.
- Subida de imágenes con Vercel Blob.
- Datos persistentes en PostgreSQL mediante Prisma (ideal para Neon).

## Publicar en GitHub + Vercel

### 1. Subir a GitHub

Creá un repositorio nuevo y subí todos los archivos de este proyecto.

### 2. Crear la base de datos

Podés usar Neon (PostgreSQL). Copiá la URL de conexión y guardala en Vercel como:

`DATABASE_URL`

### 3. Configurar el administrador

En Vercel > Settings > Environment Variables agregá:

- `ADMIN_PASSWORD`: contraseña que usarás para entrar a `/admin`. Usá al menos 12 caracteres.
- `ADMIN_SESSION_SECRET`: una cadena larga y aleatoria distinta de la contraseña.

### 4. Habilitar subida de imágenes

En Vercel, agregá un Blob Store al proyecto. Vercel crea automáticamente la variable:

`BLOB_READ_WRITE_TOKEN`

### 5. Deploy

Vercel detecta Next.js automáticamente. El comando de build ya crea/actualiza las tablas necesarias y carga los ocho artistas la primera vez. El seed es seguro: si un artista ya existe, no pisa la biografía ni el Instagram que hayas editado desde el administrador.

Cada cambio que subas a la rama principal de GitHub genera una nueva versión del sitio.

## Administrar el sitio

Entrá a:

`https://TU-DOMINIO/admin`

Desde ahí podés:

- agregar obras;
- subir la foto de cada obra;
- indicar título, artista, técnica, medidas, año y descripción;
- ocultar una obra sin borrarla;
- editar o eliminar una obra;
- cambiar las biografías de los artistas;
- agregar o modificar sus perfiles de Instagram.

No es necesario entrar a GitHub para hacer estos cambios de contenido.

## Dominio propio

Cuando tengas el dominio (por ejemplo `arsvita.uy`), se conecta desde Vercel > Project > Settings > Domains. La web y el administrador siguen funcionando igual.
