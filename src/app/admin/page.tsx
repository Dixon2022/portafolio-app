import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  addApp,
  addCertification,
  addExperience,
  addLanguage,
  addProject,
  addSkill,
  addSocial,
  deleteApp,
  deleteCertification,
  deleteExperience,
  deleteLanguage,
  deleteProject,
  deleteSkill,
  deleteSocial,
  updateApp,
  updateCertification,
  updateExperience,
  updateLanguage,
  updateProfile,
  updateProject,
  updateSkill,
  updateSocial,
} from "@/app/admin/actions";
import { LogoutButton } from "@/components/admin/logout-button";
import { authOptions } from "@/lib/auth-options";
import { getPortfolioContent } from "@/lib/portfolio-data";

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:bg-white focus:ring-2 focus:ring-amber-100";
const textareaClass = inputClass + " min-h-28 resize-y";
const primaryButtonClass =
  "rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-stone-50 transition hover:bg-amber-800";
const secondaryButtonClass =
  "rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-100";
const dangerButtonClass =
  "rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50";

function toInputDate(value: Date | null) {
  if (!value) {
    return "";
  }
  return new Date(value).toISOString().slice(0, 10);
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">{children}</label>;
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_16px_36px_-30px_rgba(41,37,36,0.35)] md:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-black tracking-tight text-stone-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">{subtitle}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ItemCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <article className="rounded-3xl border border-stone-200 bg-[#fffdf9] p-4 shadow-[0_14px_28px_-26px_rgba(41,37,36,0.28)]">
      <div className="mb-3">
        <h3 className="text-base font-bold text-stone-900">{title}</h3>
        {subtitle ? <p className="text-sm text-stone-500">{subtitle}</p> : null}
      </div>
      {children}
    </article>
  );
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const content = await getPortfolioContent();
  const skillsListClass =
    content.skills.length >= 5 ? "max-h-[34rem] overflow-y-auto pr-1" : "overflow-visible";
  const certsListClass =
    content.certifications.length >= 5 ? "max-h-[34rem] overflow-y-auto pr-1" : "overflow-visible";

  return (
    <main className="min-h-screen bg-[#f3efe7] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="rounded-[32px] border border-stone-300 bg-[#1f1b18] p-6 text-stone-100 shadow-[0_24px_50px_-36px_rgba(28,25,23,0.75)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.28em] text-amber-200/80">Panel privado</p>
              <h1 className="text-3xl font-black leading-tight text-stone-50">Gestion de contenido</h1>
              <p className="max-w-3xl text-sm leading-6 text-stone-300">
                Vista por secciones en tarjetas. La parte de habilidades ahora mantiene scroll interno cuando ya hay suficientes elementos para no empujar el resto del panel.
              </p>
            </div>
            <div className="space-y-3 lg:w-[280px]">
              <div className="rounded-2xl border border-white/10 bg-[#2c2622] p-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone-400">Sesion</p>
                <p className="mt-2 text-sm font-semibold text-white">{session.user.email}</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="Perfil" subtitle="Informacion principal del portafolio y resumen profesional.">
            <form action={updateProfile} className="grid gap-4">
              <div className="space-y-2">
                <FieldLabel>Nombre</FieldLabel>
                <input type="text" name="name" defaultValue={content.profile.name} className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Titular</FieldLabel>
                <input type="text" name="headline" defaultValue={content.profile.headline} className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Foto</FieldLabel>
                <input type="text" name="photoUrl" defaultValue={content.profile.photoUrl ?? ""} className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Resumen</FieldLabel>
                <textarea name="bio" defaultValue={content.profile.bio} className={textareaClass} />
              </div>
              <div>
                <button className={primaryButtonClass}>Guardar perfil</button>
              </div>
            </form>
          </Card>

          <Card title="Habilidades" subtitle="Si hay 5 o mas habilidades, esta lista usa scroll interno para evitar una pagina excesivamente larga.">
            <form action={addSkill} className="grid gap-3 rounded-3xl border border-stone-200 bg-[#f8f4ec] p-4">
              <div className="space-y-2">
                <FieldLabel>Habilidad</FieldLabel>
                <input type="text" name="name" placeholder="ASP.NET Core" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Categoria</FieldLabel>
                <input type="text" name="category" placeholder=".NET Technologies" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Orden</FieldLabel>
                <input type="number" name="sortOrder" defaultValue={0} className={inputClass} />
              </div>
              <div>
                <button className={primaryButtonClass}>Agregar habilidad</button>
              </div>
            </form>
            <div className={skillsListClass}>
              <div className="grid gap-3 md:grid-cols-2">
                {content.skills.map((skill) => (
                  <ItemCard key={skill.id} title={skill.name} subtitle={skill.category}>
                    <form action={updateSkill} className="space-y-3">
                      <input type="hidden" name="id" value={skill.id} />
                      <input type="text" name="name" defaultValue={skill.name} className={inputClass} />
                      <input type="text" name="category" defaultValue={skill.category} className={inputClass} />
                      <input type="number" name="sortOrder" defaultValue={skill.sortOrder} className={inputClass} />
                      <button className={secondaryButtonClass}>Actualizar</button>
                    </form>
                    <form action={deleteSkill} className="mt-2">
                      <input type="hidden" name="id" value={skill.id} />
                      <button className={dangerButtonClass}>Eliminar</button>
                    </form>
                  </ItemCard>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Idiomas" subtitle="Idiomas y nivel de dominio.">
            <form action={addLanguage} className="grid gap-3 rounded-3xl border border-stone-200 bg-[#f8f4ec] p-4">
              <div className="space-y-2">
                <FieldLabel>Idioma</FieldLabel>
                <input type="text" name="name" placeholder="English" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Nivel</FieldLabel>
                <input type="text" name="level" placeholder="Intermediate B1/B2" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Orden</FieldLabel>
                <input type="number" name="sortOrder" defaultValue={0} className={inputClass} />
              </div>
              <div>
                <button className={primaryButtonClass}>Agregar idioma</button>
              </div>
            </form>
            <div className="grid gap-3 md:grid-cols-2">
              {content.languages.map((language) => (
                <ItemCard key={language.id} title={language.name} subtitle={language.level}>
                  <form action={updateLanguage} className="space-y-3">
                    <input type="hidden" name="id" value={language.id} />
                    <input type="text" name="name" defaultValue={language.name} className={inputClass} />
                    <input type="text" name="level" defaultValue={language.level} className={inputClass} />
                    <input type="number" name="sortOrder" defaultValue={language.sortOrder} className={inputClass} />
                    <button className={secondaryButtonClass}>Actualizar</button>
                  </form>
                  <form action={deleteLanguage} className="mt-2">
                    <input type="hidden" name="id" value={language.id} />
                    <button className={dangerButtonClass}>Eliminar</button>
                  </form>
                </ItemCard>
              ))}
            </div>
          </Card>

          <Card title="Redes profesionales" subtitle="Links de contacto y presencia profesional.">
            <form action={addSocial} className="grid gap-3 rounded-3xl border border-stone-200 bg-[#f8f4ec] p-4">
              <div className="space-y-2">
                <FieldLabel>Plataforma</FieldLabel>
                <input type="text" name="platform" placeholder="LinkedIn" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>URL</FieldLabel>
                <input type="url" name="url" placeholder="https://..." className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Orden</FieldLabel>
                <input type="number" name="sortOrder" defaultValue={0} className={inputClass} />
              </div>
              <div>
                <button className={primaryButtonClass}>Agregar enlace</button>
              </div>
            </form>
            <div className="space-y-3">
              {content.socials.map((social) => (
                <ItemCard key={social.id} title={social.platform} subtitle={social.url}>
                  <form action={updateSocial} className="grid gap-3 md:grid-cols-3">
                    <input type="hidden" name="id" value={social.id} />
                    <input type="text" name="platform" defaultValue={social.platform} className={inputClass} />
                    <input type="url" name="url" defaultValue={social.url} className={inputClass} />
                    <input type="number" name="sortOrder" defaultValue={social.sortOrder} className={inputClass} />
                    <div>
                      <button className={secondaryButtonClass}>Actualizar</button>
                    </div>
                  </form>
                  <form action={deleteSocial} className="mt-2">
                    <input type="hidden" name="id" value={social.id} />
                    <button className={dangerButtonClass}>Eliminar</button>
                  </form>
                </ItemCard>
              ))}
            </div>
          </Card>

          <Card title="Experiencia" subtitle="Experiencias laborales y profesionales.">
            <form action={addExperience} className="grid gap-3 rounded-3xl border border-stone-200 bg-[#f8f4ec] p-4">
              <div className="space-y-2">
                <FieldLabel>Puesto</FieldLabel>
                <input type="text" name="role" placeholder=".NET Full Stack Developer" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Empresa</FieldLabel>
                <input type="text" name="company" placeholder="Team STEAM" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Ubicacion</FieldLabel>
                <input type="text" name="location" placeholder="Remote" className={inputClass} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel>Inicio</FieldLabel>
                  <input type="date" name="startDate" className={inputClass} />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Fin</FieldLabel>
                  <input type="date" name="endDate" className={inputClass} />
                </div>
              </div>
              <div className="space-y-2">
                <FieldLabel>Descripcion</FieldLabel>
                <textarea name="description" rows={5} className={textareaClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Orden</FieldLabel>
                <input type="number" name="sortOrder" defaultValue={0} className={inputClass} />
              </div>
              <div>
                <button className={primaryButtonClass}>Agregar experiencia</button>
              </div>
            </form>
            <div className="space-y-3">
              {content.experiences.map((experience) => (
                <ItemCard
                  key={experience.id}
                  title={experience.role}
                  subtitle={experience.company + " · " + (experience.location ?? "Sin ubicacion")}
                >
                  <form action={updateExperience} className="space-y-3">
                    <input type="hidden" name="id" value={experience.id} />
                    <div className="grid gap-3 md:grid-cols-2">
                      <input type="text" name="role" defaultValue={experience.role} className={inputClass} />
                      <input type="text" name="company" defaultValue={experience.company} className={inputClass} />
                      <input type="text" name="location" defaultValue={experience.location ?? ""} className={inputClass} />
                      <input type="number" name="sortOrder" defaultValue={experience.sortOrder} className={inputClass} />
                      <input type="date" name="startDate" defaultValue={toInputDate(experience.startDate)} className={inputClass} />
                      <input type="date" name="endDate" defaultValue={toInputDate(experience.endDate)} className={inputClass} />
                    </div>
                    <textarea name="description" rows={5} defaultValue={experience.description} className={textareaClass} />
                    <button className={secondaryButtonClass}>Actualizar</button>
                  </form>
                  <form action={deleteExperience} className="mt-2">
                    <input type="hidden" name="id" value={experience.id} />
                    <button className={dangerButtonClass}>Eliminar</button>
                  </form>
                </ItemCard>
              ))}
            </div>
          </Card>

          <Card title="Proyectos" subtitle="Listado de proyectos con descripcion, stack y enlace.">
            <form action={addProject} className="grid gap-3 rounded-3xl border border-stone-200 bg-[#f8f4ec] p-4">
              <div className="space-y-2">
                <FieldLabel>Nombre</FieldLabel>
                <input type="text" name="name" placeholder="Nombre del proyecto" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Descripcion</FieldLabel>
                <textarea name="description" rows={4} className={textareaClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Tecnologias</FieldLabel>
                <input type="text" name="technologies" placeholder="Next.js, Prisma, SQL" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Subir imagen</FieldLabel>
                <input type="file" name="imageFile" accept="image/*" className={inputClass} />
              </div>
              <input type="text" name="imageUrl" placeholder="URL de imagen" className={inputClass} />
              <input type="url" name="projectUrl" placeholder="URL del proyecto" className={inputClass} />
              <input type="number" name="sortOrder" defaultValue={0} className={inputClass} />
              <div>
                <button className={primaryButtonClass}>Agregar proyecto</button>
              </div>
            </form>
            <div className="space-y-3">
              {content.projects.map((project) => (
                <ItemCard key={project.id} title={project.name} subtitle={project.technologies}>
                  <form action={updateProject} className="space-y-3">
                    <input type="hidden" name="id" value={project.id} />
                    <input type="text" name="name" defaultValue={project.name} className={inputClass} />
                    <textarea name="description" rows={4} defaultValue={project.description} className={textareaClass} />
                    <input type="text" name="technologies" defaultValue={project.technologies} className={inputClass} />
                    <input type="file" name="imageFile" accept="image/*" className={inputClass} />
                    <input type="text" name="imageUrl" defaultValue={project.imageUrl ?? ""} className={inputClass} />
                    <input type="url" name="projectUrl" defaultValue={project.projectUrl ?? ""} className={inputClass} />
                    <input type="number" name="sortOrder" defaultValue={project.sortOrder} className={inputClass} />
                    <button className={secondaryButtonClass}>Actualizar</button>
                  </form>
                  <form action={deleteProject} className="mt-2">
                    <input type="hidden" name="id" value={project.id} />
                    <button className={dangerButtonClass}>Eliminar</button>
                  </form>
                </ItemCard>
              ))}
            </div>
          </Card>

          <Card title="Aplicaciones" subtitle="Apps publicadas o demostrables con su plataforma correspondiente.">
            <form action={addApp} className="grid gap-3 rounded-3xl border border-stone-200 bg-[#f8f4ec] p-4">
              <div className="space-y-2">
                <FieldLabel>Nombre</FieldLabel>
                <input type="text" name="name" placeholder="Nombre de la app" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Descripcion</FieldLabel>
                <textarea name="description" rows={4} className={textareaClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Subir imagen</FieldLabel>
                <input type="file" name="imageFile" accept="image/*" className={inputClass} />
              </div>
              <input type="text" name="platform" placeholder="Web, Android, iOS" className={inputClass} />
              <input type="text" name="imageUrl" placeholder="URL de imagen" className={inputClass} />
              <input type="url" name="downloadUrl" placeholder="URL de descarga" className={inputClass} />
              <input type="number" name="sortOrder" defaultValue={0} className={inputClass} />
              <div>
                <button className={primaryButtonClass}>Agregar aplicacion</button>
              </div>
            </form>
            <div className="space-y-3">
              {content.apps.map((app) => (
                <ItemCard key={app.id} title={app.name} subtitle={app.platform}>
                  <form action={updateApp} className="space-y-3">
                    <input type="hidden" name="id" value={app.id} />
                    <input type="text" name="name" defaultValue={app.name} className={inputClass} />
                    <textarea name="description" rows={4} defaultValue={app.description} className={textareaClass} />
                    <input type="text" name="platform" defaultValue={app.platform} className={inputClass} />
                    <input type="file" name="imageFile" accept="image/*" className={inputClass} />
                    <input type="text" name="imageUrl" defaultValue={app.imageUrl ?? ""} className={inputClass} />
                    <input type="url" name="downloadUrl" defaultValue={app.downloadUrl ?? ""} className={inputClass} />
                    <input type="number" name="sortOrder" defaultValue={app.sortOrder} className={inputClass} />
                    <button className={secondaryButtonClass}>Actualizar</button>
                  </form>
                  <form action={deleteApp} className="mt-2">
                    <input type="hidden" name="id" value={app.id} />
                    <button className={dangerButtonClass}>Eliminar</button>
                  </form>
                </ItemCard>
              ))}
            </div>
          </Card>

          <Card title="Certificaciones" subtitle="Certificaciones obtenidas con su emisor y enlace al certificado.">
            <form action={addCertification} className="grid gap-3 rounded-3xl border border-stone-200 bg-[#f8f4ec] p-4">
              <div className="space-y-2">
                <FieldLabel>Nombre del certificado</FieldLabel>
                <input type="text" name="name" placeholder="Ej. Azure Fundamentals AZ-900" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Emisor</FieldLabel>
                <input type="text" name="issuer" placeholder="Microsoft, Google, Coursera..." className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Fecha de emision</FieldLabel>
                <input type="text" name="issueDate" placeholder="Ej. Marzo 2025" className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>URL del certificado</FieldLabel>
                <input type="url" name="certificateUrl" placeholder="https://drive.google.com/..." className={inputClass} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Orden</FieldLabel>
                <input type="number" name="sortOrder" defaultValue={0} className={inputClass} />
              </div>
              <div>
                <button className={primaryButtonClass}>Agregar certificacion</button>
              </div>
            </form>
            <div className={certsListClass}>
              <div className="grid gap-3 md:grid-cols-2">
                {content.certifications.map((cert) => (
                  <ItemCard key={cert.id} title={cert.name} subtitle={cert.issuer}>
                    <form action={updateCertification} className="space-y-3">
                      <input type="hidden" name="id" value={cert.id} />
                      <input type="text" name="name" defaultValue={cert.name} className={inputClass} />
                      <input type="text" name="issuer" defaultValue={cert.issuer} className={inputClass} />
                      <input type="text" name="issueDate" defaultValue={cert.issueDate ?? ""} className={inputClass} />
                      <input type="url" name="certificateUrl" defaultValue={cert.certificateUrl ?? ""} className={inputClass} />
                      <input type="number" name="sortOrder" defaultValue={cert.sortOrder} className={inputClass} />
                      <button className={secondaryButtonClass}>Actualizar</button>
                    </form>
                    <form action={deleteCertification} className="mt-2">
                      <input type="hidden" name="id" value={cert.id} />
                      <button className={dangerButtonClass}>Eliminar</button>
                    </form>
                  </ItemCard>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}