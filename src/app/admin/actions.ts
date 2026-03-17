"use server";

import { randomUUID } from "node:crypto";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getOrCreateProfile } from "@/lib/portfolio-data";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  name: z.string().min(2),
  headline: z.string().min(3),
  bio: z.string().min(10),
  photoUrl: z.string().optional(),
});

const skillSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const socialSchema = z.object({
  platform: z.string().min(2),
  url: z.string().url(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const experienceSchema = z.object({
  role: z.string().min(2),
  company: z.string().min(2),
  location: z.string().optional(),
  startDate: z.string().min(4),
  endDate: z.string().optional(),
  description: z.string().min(10),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  technologies: z.string().min(2),
  imageUrl: z.string().optional(),
  projectUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const appSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  platform: z.string().min(2),
  imageUrl: z.string().optional(),
  downloadUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function getImageExtension(file: File) {
  if (file.type === "image/jpeg") {
    return "jpg";
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  if (file.type === "image/gif") {
    return "gif";
  }

  if (file.type === "image/svg+xml") {
    return "svg";
  }

  return "bin";
}

async function saveImageFromFormData(formData: FormData, fieldName: string) {
  const fileValue = formData.get(fieldName);

  if (!(fileValue instanceof File) || fileValue.size === 0) {
    return null;
  }

  if (!fileValue.type.startsWith("image/")) {
    return null;
  }

  if (fileValue.size > MAX_IMAGE_SIZE_BYTES) {
    return null;
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });

  const extension = getImageExtension(fileValue);
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const buffer = Buffer.from(await fileValue.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

const languageSchema = z.object({
  name: z.string().min(2),
  level: z.string().min(2),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

const certificationSchema = z.object({
  name: z.string().min(2),
  issuer: z.string().min(2),
  issueDate: z.string().optional(),
  certificateUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

function dateOrNull(value?: string) {
  if (!value || value.trim() === "") {
    return null;
  }

  return new Date(value);
}

function cleanupOptional(value?: string) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export async function updateProfile(formData: FormData) {
  const parsed = profileSchema.parse(Object.fromEntries(formData));
  const profile = await getOrCreateProfile();

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      name: parsed.name,
      headline: parsed.headline,
      bio: parsed.bio,
      photoUrl: cleanupOptional(parsed.photoUrl),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addSkill(formData: FormData) {
  const parsed = skillSchema.parse(Object.fromEntries(formData));
  const profile = await getOrCreateProfile();

  await prisma.skill.create({
    data: {
      ...parsed,
      profileId: profile.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteSkill(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateSkill(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  const parsed = skillSchema.parse(Object.fromEntries(formData));

  await prisma.skill.update({
    where: { id },
    data: parsed,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addSocial(formData: FormData) {
  const parsed = socialSchema.parse(Object.fromEntries(formData));
  const profile = await getOrCreateProfile();

  await prisma.socialLink.create({
    data: {
      ...parsed,
      profileId: profile.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteSocial(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateSocial(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  const parsed = socialSchema.parse(Object.fromEntries(formData));

  await prisma.socialLink.update({
    where: { id },
    data: parsed,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addExperience(formData: FormData) {
  const parsed = experienceSchema.parse(Object.fromEntries(formData));
  const profile = await getOrCreateProfile();

  await prisma.experience.create({
    data: {
      role: parsed.role,
      company: parsed.company,
      location: cleanupOptional(parsed.location),
      startDate: new Date(parsed.startDate),
      endDate: dateOrNull(parsed.endDate),
      description: parsed.description,
      sortOrder: parsed.sortOrder,
      profileId: profile.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateExperience(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  const parsed = experienceSchema.parse(Object.fromEntries(formData));

  await prisma.experience.update({
    where: { id },
    data: {
      role: parsed.role,
      company: parsed.company,
      location: cleanupOptional(parsed.location),
      startDate: new Date(parsed.startDate),
      endDate: dateOrNull(parsed.endDate),
      description: parsed.description,
      sortOrder: parsed.sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteExperience(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addProject(formData: FormData) {
  const parsed = projectSchema.parse(Object.fromEntries(formData));
  const profile = await getOrCreateProfile();
  const uploadedImageUrl = await saveImageFromFormData(formData, "imageFile");

  await prisma.project.create({
    data: {
      name: parsed.name,
      description: parsed.description,
      technologies: parsed.technologies,
      imageUrl: uploadedImageUrl ?? cleanupOptional(parsed.imageUrl),
      projectUrl: cleanupOptional(parsed.projectUrl),
      sortOrder: parsed.sortOrder,
      profileId: profile.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateProject(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  const parsed = projectSchema.parse(Object.fromEntries(formData));
  const uploadedImageUrl = await saveImageFromFormData(formData, "imageFile");

  await prisma.project.update({
    where: { id },
    data: {
      name: parsed.name,
      description: parsed.description,
      technologies: parsed.technologies,
      imageUrl: uploadedImageUrl ?? cleanupOptional(parsed.imageUrl),
      projectUrl: cleanupOptional(parsed.projectUrl),
      sortOrder: parsed.sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProject(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addApp(formData: FormData) {
  const parsed = appSchema.parse(Object.fromEntries(formData));
  const profile = await getOrCreateProfile();
  const uploadedImageUrl = await saveImageFromFormData(formData, "imageFile");

  await prisma.appItem.create({
    data: {
      name: parsed.name,
      description: parsed.description,
      platform: parsed.platform,
      imageUrl: uploadedImageUrl ?? cleanupOptional(parsed.imageUrl),
      downloadUrl: cleanupOptional(parsed.downloadUrl),
      sortOrder: parsed.sortOrder,
      profileId: profile.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateApp(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  const parsed = appSchema.parse(Object.fromEntries(formData));
  const uploadedImageUrl = await saveImageFromFormData(formData, "imageFile");

  await prisma.appItem.update({
    where: { id },
    data: {
      name: parsed.name,
      description: parsed.description,
      platform: parsed.platform,
      imageUrl: uploadedImageUrl ?? cleanupOptional(parsed.imageUrl),
      downloadUrl: cleanupOptional(parsed.downloadUrl),
      sortOrder: parsed.sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteApp(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  await prisma.appItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addLanguage(formData: FormData) {
  const parsed = languageSchema.parse(Object.fromEntries(formData));
  const profile = await getOrCreateProfile();

  await prisma.language.create({
    data: {
      name: parsed.name,
      level: parsed.level,
      sortOrder: parsed.sortOrder,
      profileId: profile.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateLanguage(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  const parsed = languageSchema.parse(Object.fromEntries(formData));

  await prisma.language.update({
    where: { id },
    data: {
      name: parsed.name,
      level: parsed.level,
      sortOrder: parsed.sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteLanguage(formData: FormData) {
  const id = z.string().parse(formData.get("id"));

  await prisma.language.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addCertification(formData: FormData) {
  const parsed = certificationSchema.parse(Object.fromEntries(formData));
  const profile = await getOrCreateProfile();

  await prisma.certification.create({
    data: {
      name: parsed.name,
      issuer: parsed.issuer,
      issueDate: cleanupOptional(parsed.issueDate),
      certificateUrl: cleanupOptional(parsed.certificateUrl),
      sortOrder: parsed.sortOrder,
      profileId: profile.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateCertification(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  const parsed = certificationSchema.parse(Object.fromEntries(formData));

  await prisma.certification.update({
    where: { id },
    data: {
      name: parsed.name,
      issuer: parsed.issuer,
      issueDate: cleanupOptional(parsed.issueDate),
      certificateUrl: cleanupOptional(parsed.certificateUrl),
      sortOrder: parsed.sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteCertification(formData: FormData) {
  const id = z.string().parse(formData.get("id"));
  await prisma.certification.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}