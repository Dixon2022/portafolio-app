import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingProfile = await prisma.profile.findFirst();

  const profile =
    existingProfile ??
    (await prisma.profile.create({
      data: {
        name: "Dixon Araya",
        headline: ".NET Full Stack Developer",
        bio: "Desarrollador .NET enfocado en arquitectura limpia, APIs robustas y productos web escalables.",
        photoUrl: "",
      },
    }));

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      name: "Dixon Araya",
      headline: ".NET Full Stack Developer",
      bio: "Desarrollador .NET enfocado en arquitectura limpia, APIs robustas y productos web escalables.",
      photoUrl: "",
      skills: {
        deleteMany: {},
      },
      socials: {
        deleteMany: {},
      },
    },
  });

  await prisma.skill.createMany({
    data: [
      { name: "ASP.NET Core", category: ".NET", sortOrder: 1, profileId: profile.id },
      { name: "C#", category: "Lenguajes", sortOrder: 2, profileId: profile.id },
      { name: "SQL Server", category: "Base de datos", sortOrder: 3, profileId: profile.id },
      { name: "Prisma", category: "ORM", sortOrder: 4, profileId: profile.id },
      { name: "Next.js", category: "Frontend", sortOrder: 5, profileId: profile.id },
    ],
  });

  await prisma.socialLink.createMany({
    data: [
      { platform: "GitHub", url: "https://github.com/", sortOrder: 1, profileId: profile.id },
      { platform: "LinkedIn", url: "https://linkedin.com/", sortOrder: 2, profileId: profile.id },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });