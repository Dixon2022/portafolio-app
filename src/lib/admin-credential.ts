import { prisma } from "@/lib/prisma";

type AdminCredentialDelegate = {
  findUnique: (args: { where: { email: string } }) => Promise<{ id: string; email: string; passwordHash: string } | null>;
  create: (args: { data: { email: string; passwordHash: string } }) => Promise<{ id: string; email: string; passwordHash: string }>;
};

function getAdminCredentialDelegate(): AdminCredentialDelegate {
  return (prisma as unknown as { adminCredential: AdminCredentialDelegate }).adminCredential;
}

function getEnvAdminCredential() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !passwordHash) {
    return null;
  }

  return { email, passwordHash };
}

export async function getOrCreateAdminCredentialByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const adminCredential = getAdminCredentialDelegate();

  const existing = await adminCredential.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return existing;
  }

  const envCredential = getEnvAdminCredential();

  if (!envCredential || envCredential.email.toLowerCase() !== normalizedEmail) {
    return null;
  }

  return adminCredential.create({
    data: {
      email: normalizedEmail,
      passwordHash: envCredential.passwordHash,
    },
  });
}

export async function getOrCreateEnvAdminCredential() {
  const envCredential = getEnvAdminCredential();

  if (!envCredential) {
    return null;
  }

  return getOrCreateAdminCredentialByEmail(envCredential.email);
}
