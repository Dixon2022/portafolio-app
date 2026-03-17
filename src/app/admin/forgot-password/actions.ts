"use server";

import { hash } from "bcryptjs";
import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getOrCreateAdminCredentialByEmail } from "@/lib/admin-credential";
import { sendPasswordResetEmail } from "@/lib/password-reset-email";
import { prisma } from "@/lib/prisma";

type AdminCredentialRow = {
  id: string;
  email: string;
  passwordHash: string;
  resetToken: string | null;
  resetTokenExpiresAt: Date | null;
};

type AdminCredentialDelegate = {
  update: (args: {
    where: { id: string };
    data: {
      resetToken?: string | null;
      resetTokenExpiresAt?: Date | null;
      passwordHash?: string;
    };
  }) => Promise<AdminCredentialRow>;
  findFirst: (args: {
    where: {
      resetToken: string;
      resetTokenExpiresAt: {
        gt: Date;
      };
    };
  }) => Promise<AdminCredentialRow | null>;
};

function getAdminCredentialDelegate(): AdminCredentialDelegate {
  return (prisma as unknown as { adminCredential: AdminCredentialDelegate }).adminCredential;
}

const requestSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z
  .object({
    token: z.string().min(10),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  });

export async function requestPasswordReset(formData: FormData) {
  const adminCredential = getAdminCredentialDelegate();
  const { email } = requestSchema.parse(Object.fromEntries(formData));
  const normalizedEmail = email.trim().toLowerCase();

  const credential = await getOrCreateAdminCredentialByEmail(normalizedEmail);

  if (!credential) {
    redirect("/admin/forgot-password?sent=1");
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await adminCredential.update({
    where: { id: credential.id },
    data: {
      resetToken: token,
      resetTokenExpiresAt: expiresAt,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

  try {
    const emailResult = await sendPasswordResetEmail(normalizedEmail, resetUrl);

    if (emailResult.sent) {
      redirect("/admin/forgot-password?sent=1&emailed=1");
    }
  } catch {
    // Keep silent to avoid exposing transport details to users.
  }

  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    redirect(`/admin/forgot-password?sent=1&token=${token}&emailed=0`);
  }

  redirect("/admin/forgot-password?sent=1&emailed=0");
}

export async function resetPassword(formData: FormData) {
  const adminCredential = getAdminCredentialDelegate();
  const parsed = resetSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const token = String(formData.get("token") ?? "");
    redirect(`/admin/reset-password?token=${token}&error=1`);
  }

  const { token, password } = parsed.data;

  const credential = await adminCredential.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!credential) {
    redirect("/admin/reset-password?error=token");
  }

  const passwordHash = await hash(password, 10);

  await adminCredential.update({
    where: { id: credential.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  redirect("/admin/login?reset=1");
}
