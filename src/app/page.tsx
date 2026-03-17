import Image from "next/image";
import Link from "next/link";
import { getPortfolioContent } from "@/lib/portfolio-data";

function getGoogleDriveFileId(url: string) {
  const filePathMatch = url.match(/\/file\/d\/([^/]+)/);

  if (filePathMatch?.[1]) {
    return filePathMatch[1];
  }

  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("id");
  } catch {
    return null;
  }
}

function normalizeImageUrl(url: string | null) {
  if (!url) {
    return null;
  }

  if (url.includes("drive.google.com")) {
    const fileId = getGoogleDriveFileId(url);

    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  return url;
}

function splitTechnologies(raw: string) {
  return raw
    .split(",")
    .map((tech) => tech.trim())
    .filter((tech) => tech.length > 0);
}

export default async function Home() {
  const content = await getPortfolioContent();
  const skillsListClass =
    content.skills.length >= 5
      ? "mt-3 max-h-[25rem] space-y-2 overflow-y-auto pr-1 text-sm text-slate-700"
      : "mt-3 space-y-2 text-sm text-slate-700";
  const certsListClass =
    content.certifications.length >= 5
      ? "mt-3 max-h-[25rem] space-y-2 overflow-y-auto pr-1"
      : "mt-3 space-y-2";
  const profileImageSrc = normalizeImageUrl(content.profile.photoUrl);

  return (
    <main className="min-h-screen bg-[linear-gradient(160deg,#f8fafc_0%,#ecfdf5_35%,#ffffff_100%)] px-5 py-10 text-slate-900 md:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-emerald-200/60 bg-white/80 p-6 shadow-md backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.9fr)]">
            <div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-18 w-18 overflow-hidden rounded-2xl bg-slate-200">
                    {profileImageSrc ? (
                      <Image src={profileImageSrc} alt={content.profile.name} fill className="object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">Portafolio profesional</p>
                    <h1 className="text-3xl font-black leading-tight">{content.profile.name}</h1>
                    <p className="text-sm text-slate-600">{content.profile.headline}</p>
                  </div>
                </div>
                <Link href="/admin/login" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                  Acceso administrador
                </Link>
              </div>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-700">{content.profile.bio}</p>
            </div>

            <aside className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
              <h2 className="text-lg font-bold text-slate-900">Contacto</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {content.socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{social.platform}</span>
                    <span className="mt-1 block break-words text-sm text-slate-700">{social.url}</span>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-1">
            <h2 className="text-lg font-bold">Habilidades tecnicas</h2>
            <ul className={skillsListClass}>
              {content.skills.map((skill) => (
                <li key={skill.id} className="rounded-lg bg-slate-100 px-3 py-2">
                  <span className="font-semibold">{skill.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{skill.category}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-1">
            <h2 className="text-lg font-bold">Idiomas</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {content.languages.map((language) => (
                <li key={language.id} className="rounded-lg bg-slate-100 px-3 py-2">
                  <span className="font-semibold">{language.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{language.level}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-8">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Experiencia</h2>
            <div className="mt-3 space-y-4">
              {content.experiences.map((experience) => (
                <div key={experience.id} className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{experience.company}</p>
                  <h3 className="text-base font-bold">{experience.role}</h3>
                  <p className="text-sm text-slate-500">{experience.location ?? "Remoto"}</p>
                  <p className="mt-2 text-sm text-slate-700">{experience.description}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Proyectos</h2>
            <div className="mt-3 space-y-3">
              {content.projects.map((project) => {
                const technologies = splitTechnologies(project.technologies);

                return (
                  <div key={project.id} className="rounded-lg border border-slate-200 p-4">
                    {normalizeImageUrl(project.imageUrl) ? (
                      <div className="relative mb-3 h-44 w-full overflow-hidden rounded-lg bg-slate-100 p-2">
                        <Image src={normalizeImageUrl(project.imageUrl) ?? ""} alt={project.name} fill className="object-contain" />
                      </div>
                    ) : null}
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-slate-600">{project.description}</p>
                    <div className="mt-3">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Tecnologias</p>
                      <div className="flex flex-wrap gap-2">
                        {technologies.map((technology) => (
                          <span
                            key={`${project.id}-${technology}`}
                            className="rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.projectUrl ? (
                      <a href={project.projectUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-emerald-700 hover:underline">
                        Ver proyecto
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Aplicaciones desarrolladas</h2>
            <div className="mt-3 space-y-3">
              {content.apps.map((app) => (
                <div key={app.id} className="rounded-lg border border-slate-200 p-4">
                  {normalizeImageUrl(app.imageUrl) ? (
                    <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg bg-slate-100 p-2">
                      <Image src={normalizeImageUrl(app.imageUrl) ?? ""} alt={app.name} fill className="object-contain" />
                    </div>
                  ) : null}
                  <h3 className="font-semibold">{app.name}</h3>
                  <p className="text-sm text-slate-600">{app.description}</p>
                  <div className="mt-3">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Plataforma</p>
                    <div className="flex flex-wrap gap-2">
                      {splitTechnologies(app.platform).map((platform) => (
                        <span key={`${app.id}-${platform}`} className="rounded-full bg-violet-700 px-3 py-1 text-xs font-semibold text-white">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  {app.downloadUrl ? (
                    <a href={app.downloadUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-emerald-700 hover:underline">
                      Descargar o abrir
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        </section>

        {content.certifications.length > 0 ? (
          <section className="mt-8">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">Certificaciones</h2>
              <div className={certsListClass}>
                {content.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 p-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold leading-snug">{cert.name}</h3>
                      <p className="mt-0.5 text-sm text-slate-500">{cert.issuer}</p>
                      {cert.issueDate ? <p className="mt-0.5 text-xs text-slate-400">{cert.issueDate}</p> : null}
                    </div>
                    {cert.certificateUrl ? (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        Ver certificado
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}
