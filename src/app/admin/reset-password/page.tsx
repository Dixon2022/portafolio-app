import Link from "next/link";
import { resetPassword } from "@/app/admin/forgot-password/actions";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string; error?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#dbeafe_0%,#cffafe_35%,#f8fafc_100%)] px-6 py-16">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-black text-slate-900">Nueva contrasena</h1>
        <p className="mt-2 text-sm text-slate-600">Define una nueva contrasena para el administrador.</p>

        {params.error ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            El enlace no es valido o expiro. Genera uno nuevo desde &quot;Olvide mi contrasena&quot;.
          </p>
        ) : null}

        <form action={resetPassword} className="mt-6 space-y-3">
          <input type="hidden" name="token" value={token} />
          <input
            required
            type="password"
            name="password"
            placeholder="Nueva contrasena"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            required
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contrasena"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Guardar contrasena
          </button>
        </form>

        <Link href="/admin/login" className="mt-6 inline-block text-sm font-semibold text-slate-700 underline">
          Volver al login
        </Link>
      </div>
    </main>
  );
}
