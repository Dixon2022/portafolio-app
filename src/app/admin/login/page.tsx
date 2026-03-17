import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";

interface AdminLoginPageProps {
  searchParams: Promise<{ reset?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#d1fae5_0%,#ecfeff_35%,#f8fafc_100%)] px-6 py-16">
      <div className="mx-auto grid w-full max-w-4xl gap-8 md:grid-cols-2">
        <section className="rounded-2xl bg-slate-900 p-8 text-slate-100 shadow-xl">
          <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">Admin</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">Panel privado de portafolio</h1>
          <p className="mt-4 text-sm text-slate-300">
            Ingresa con tus credenciales para gestionar perfil, experiencia, proyectos y aplicaciones.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold transition hover:border-slate-100"
          >
            Volver al sitio publico
          </Link>
        </section>

        <section className="self-center">
          <LoginForm showResetMessage={params.reset === "1"} />
        </section>
      </div>
    </main>
  );
}