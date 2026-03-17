import Link from "next/link";
import { requestPasswordReset } from "@/app/admin/forgot-password/actions";

interface ForgotPasswordPageProps {
  searchParams: Promise<{ sent?: string; token?: string; emailed?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const emailed = params.emailed === "1";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_80%_10%,#bbf7d0_0%,#dbeafe_35%,#f8fafc_100%)] px-6 py-16">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-black text-slate-900">Recuperar acceso admin</h1>
        <p className="mt-2 text-sm text-slate-600">
          Escribe tu email administrador para generar un enlace temporal de cambio de contrasena.
        </p>

        <form action={requestPasswordReset} className="mt-6 space-y-3">
          <input
            required
            name="email"
            type="email"
            placeholder="admin@portafolio.local"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Generar enlace
          </button>
        </form>

        {sent ? (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            <p>
              {emailed
                ? "Solicitud procesada. Revisa tu correo para continuar con la recuperacion."
                : "Solicitud procesada. No fue posible enviar el correo en este entorno."}
            </p>
            {params.token ? (
              <p className="mt-2 break-all">
                Enlace temporal (modo desarrollo):{" "}
                <Link href={`/admin/reset-password?token=${params.token}`} className="font-semibold underline">
                  /admin/reset-password?token={params.token}
                </Link>
              </p>
            ) : null}
          </div>
        ) : null}

        <Link href="/admin/login" className="mt-6 inline-block text-sm font-semibold text-slate-700 underline">
          Volver al login
        </Link>
      </div>
    </main>
  );
}
