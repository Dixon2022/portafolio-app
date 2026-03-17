import type { PortfolioContent } from "@/types/content";
import { prisma } from "@/lib/prisma";

export async function getOrCreateProfile() {
  const firstProfile = await prisma.profile.findFirst();

  if (firstProfile) {
    return firstProfile;
  }

  return prisma.profile.create({
    data: {
      name: "Tu Nombre",
      headline: "Tu titular profesional",
      bio: "Describe brevemente tu enfoque profesional.",
      photoUrl: "",
    },
  });
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const profile = await getOrCreateProfile();

  const [skills, socials, experiences, projects, apps, languages, certifications] = await Promise.all([
    prisma.skill.findMany({
      where: { profileId: profile.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.socialLink.findMany({
      where: { profileId: profile.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.experience.findMany({
      where: { profileId: profile.id },
      orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    }),
    prisma.project.findMany({
      where: { profileId: profile.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.appItem.findMany({
      where: { profileId: profile.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.language.findMany({
      where: { profileId: profile.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.certification.findMany({
      where: { profileId: profile.id },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return {
    profile,
    skills,
    socials,
    experiences,
    projects,
    apps,
    languages,
    certifications,
  };
}