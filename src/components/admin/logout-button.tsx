"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-2xl border border-amber-300/30 bg-[#3a322d] px-4 py-3 text-sm font-semibold text-stone-100 transition hover:bg-[#4a4038]"
    >
      Cerrar sesion
    </button>
  );
}