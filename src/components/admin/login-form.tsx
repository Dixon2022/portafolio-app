"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginFormProps {
  showResetMessage?: boolean;
}

export function LoginForm({ showResetMessage = false }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });

    setIsLoading(false);

    if (response?.error) {
      setError("Credenciales incorrectas.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white/95 p-6 shadow-lg">
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
        <input
          required
          type="email"
          name="email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-emerald-300 focus:ring"
          placeholder="admin@email.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Contraseña</label>
        <input
          required
          type="password"
          name="password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-emerald-300 focus:ring"
        />
      </div>

        {showResetMessage ? (
          <p className="text-sm text-emerald-700">Contrasena actualizada. Inicia sesion con la nueva clave.</p>
        ) : null}
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}

        <div className="text-right">
          <Link href="/admin/forgot-password" className="text-xs font-semibold text-slate-600 underline">
            Olvide mi contrasena
          </Link>
        </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}