import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loginAction } from "@/app/actions/admin";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const params = await searchParams;
  return (
    <main className="admin-shell login-shell">
      <section className="admin-login-card">
        <img src="/brand/ars-vita-logo.png" alt="ARS VITA" className="admin-logo" />
        <p className="eyebrow">Administración</p>
        <h1>Ingresar</h1>
        <p className="admin-muted">Desde acá se administran las obras, biografías y vínculos de Instagram.</p>
        {params.error && <p className="admin-error">La contraseña no es correcta.</p>}
        <form action={loginAction} className="admin-form">
          <label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="button primary" type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}
