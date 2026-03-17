import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const profile =
    (await prisma.profile.findFirst()) ??
    (await prisma.profile.create({
      data: {
        name: "DIXON ARAYA",
        headline: ".NET Full Stack Developer | ASP.NET Core | C# | SQL Server",
        bio: "Dedicated .NET Developer with comprehensive experience building enterprise web applications using ASP.NET Core, C#, and SQL Server.",
        photoUrl: "",
      },
    }));

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      name: "DIXON ARAYA",
      headline: ".NET Full Stack Developer | ASP.NET Core | C# | SQL Server",
      bio: "Dedicated .NET Developer with comprehensive experience building enterprise web applications using ASP.NET Core, C#, and SQL Server. Proficient in full software development lifecycle with expertise in MVC architecture, RESTful API development, Entity Framework Core, and database design. Skilled in implementing SOLID principles and design patterns to deliver scalable, maintainable solutions in Agile environments. Education: Bachelor's Degree in Business Computing (University of Costa Rica), Mid-Level Technician (Zarcero Technical College). Certifications: Scrum Fundamentals Certified, Fundamentals of Agile PM, Celonis Process Mining, Generative AI for PM.",
      photoUrl: "",
    },
  });

  await prisma.skill.deleteMany({ where: { profileId: profile.id } });
  await prisma.socialLink.deleteMany({ where: { profileId: profile.id } });
  await prisma.experience.deleteMany({ where: { profileId: profile.id } });
  await prisma.language.deleteMany({ where: { profileId: profile.id } });

  await prisma.skill.createMany({
    data: [
      { name: "ASP.NET Core", category: ".NET Technologies", sortOrder: 1, profileId: profile.id },
      { name: "ASP.NET MVC", category: ".NET Technologies", sortOrder: 2, profileId: profile.id },
      { name: "ASP.NET Web API", category: ".NET Technologies", sortOrder: 3, profileId: profile.id },
      { name: "Razor Pages", category: ".NET Technologies", sortOrder: 4, profileId: profile.id },
      { name: ".NET 6/7/8", category: ".NET Technologies", sortOrder: 5, profileId: profile.id },
      { name: "Entity Framework Core", category: ".NET Technologies", sortOrder: 6, profileId: profile.id },
      { name: "C#", category: "Languages", sortOrder: 7, profileId: profile.id },
      { name: "T-SQL", category: "Languages", sortOrder: 8, profileId: profile.id },
      { name: "JavaScript (ES6+)", category: "Languages", sortOrder: 9, profileId: profile.id },
      { name: "HTML5", category: "Languages", sortOrder: 10, profileId: profile.id },
      { name: "CSS3", category: "Languages", sortOrder: 11, profileId: profile.id },
      { name: "SQL Server", category: "Database", sortOrder: 12, profileId: profile.id },
      { name: "Stored Procedures", category: "Database", sortOrder: 13, profileId: profile.id },
      { name: "Query Optimization", category: "Database", sortOrder: 14, profileId: profile.id },
      { name: "MVC / MVVM / Microservices", category: "Architecture", sortOrder: 15, profileId: profile.id },
      { name: "SOLID Principles", category: "Architecture", sortOrder: 16, profileId: profile.id },
      { name: "Dependency Injection", category: "Architecture", sortOrder: 17, profileId: profile.id },
      { name: "Clean Architecture", category: "Architecture", sortOrder: 18, profileId: profile.id },
      { name: "Azure (App Service, SQL Database, Storage)", category: "Cloud & DevOps", sortOrder: 19, profileId: profile.id },
      { name: "AWS", category: "Cloud & DevOps", sortOrder: 20, profileId: profile.id },
      { name: "Docker", category: "Cloud & DevOps", sortOrder: 21, profileId: profile.id },
      { name: "Kubernetes (basic)", category: "Cloud & DevOps", sortOrder: 22, profileId: profile.id },
      { name: "CI/CD Pipelines", category: "Cloud & DevOps", sortOrder: 23, profileId: profile.id },
      { name: "Git / Jira / Postman / Swagger", category: "Tools & Practices", sortOrder: 24, profileId: profile.id },
      { name: "Unit Testing", category: "Tools & Practices", sortOrder: 25, profileId: profile.id },
      { name: "Agile / Scrum", category: "Tools & Practices", sortOrder: 26, profileId: profile.id },
    ],
  });

  await prisma.socialLink.createMany({
    data: [
      { platform: "Email", url: "mailto:dixon.araya2002@gmail.com", sortOrder: 1, profileId: profile.id },
      { platform: "Telefono", url: "tel:+50661191116", sortOrder: 2, profileId: profile.id },
      { platform: "LinkedIn", url: "https://linkedin.com", sortOrder: 3, profileId: profile.id },
      { platform: "GitHub", url: "https://github.com", sortOrder: 4, profileId: profile.id },
      { platform: "Ubicacion", url: "https://maps.google.com/?q=San+Ramon,+Costa+Rica", sortOrder: 5, profileId: profile.id },
    ],
  });

  await prisma.experience.createMany({
    data: [
      {
        role: ".NET Full Stack Developer",
        company: "Team STEAM",
        location: "Remote",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-12-31"),
        description:
          "Developed backend services and APIs using ASP.NET Core and C#, implementing RESTful architecture, authentication, and security best practices. Designed and optimized SQL Server structures and indexes, improving query performance by 40%. Implemented Entity Framework Core with migrations and repository pattern, and delivered responsive frontend components integrated with backend APIs.",
        sortOrder: 1,
        profileId: profile.id,
      },
      {
        role: "ASP.NET Developer - Business Management System",
        company: "Amores Bakery",
        location: "Costa Rica",
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-06-30"),
        description:
          "Architected a business management system using ASP.NET Core Razor Pages with MVC principles. Built RESTful controllers with model validation, designed relational schema using Entity Framework Core Code-First, and implemented audit logging via EF interceptors for compliance tracking.",
        sortOrder: 2,
        profileId: profile.id,
      },
    ],
  });

  await prisma.language.createMany({
    data: [
      { name: "Spanish", level: "Native", sortOrder: 1, profileId: profile.id },
      { name: "English", level: "Intermediate B1/B2", sortOrder: 2, profileId: profile.id },
      { name: "Portuguese", level: "Basic A2", sortOrder: 3, profileId: profile.id },
    ],
  });

  console.log("PROFILE_UPDATED", profile.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
