export interface ProfileContent {
  id: string;
  name: string;
  headline: string;
  bio: string;
  photoUrl: string | null;
}

export interface SkillContent {
  id: string;
  name: string;
  category: string;
  sortOrder: number;
}

export interface SocialContent {
  id: string;
  platform: string;
  url: string;
  sortOrder: number;
}

export interface ExperienceContent {
  id: string;
  role: string;
  company: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  description: string;
  sortOrder: number;
}

export interface ProjectContent {
  id: string;
  name: string;
  description: string;
  technologies: string;
  imageUrl: string | null;
  projectUrl: string | null;
  sortOrder: number;
}

export interface AppContent {
  id: string;
  name: string;
  description: string;
  platform: string;
  imageUrl: string | null;
  downloadUrl: string | null;
  sortOrder: number;
}

export interface LanguageContent {
  id: string;
  name: string;
  level: string;
  sortOrder: number;
}

export interface CertificationContent {
  id: string;
  name: string;
  issuer: string;
  issueDate: string | null;
  certificateUrl: string | null;
  sortOrder: number;
}

export interface PortfolioContent {
  profile: ProfileContent;
  skills: SkillContent[];
  socials: SocialContent[];
  experiences: ExperienceContent[];
  projects: ProjectContent[];
  apps: AppContent[];
  languages: LanguageContent[];
  certifications: CertificationContent[];
}