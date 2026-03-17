import nodemailer from "nodemailer";

type SendPasswordResetEmailResult = {
  sent: boolean;
};

function buildResetEmailHtml(resetUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
      <h2 style="margin-bottom: 8px;">Recuperacion de cuenta admin</h2>
      <p>Recibimos una solicitud para cambiar la contrasena de tu cuenta de administrador.</p>
      <p>
        <a
          href="${resetUrl}"
          style="display: inline-block; padding: 10px 16px; border-radius: 8px; background: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600;"
        >
          Cambiar contrasena
        </a>
      </p>
      <p>Este enlace vence en 15 minutos.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    </div>
  `;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<SendPasswordResetEmailResult> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "0");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    return { sent: false };
  }

  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Recuperacion de cuenta admin",
    text: `Cambia tu contrasena usando este enlace: ${resetUrl}`,
    html: buildResetEmailHtml(resetUrl),
  });

  return { sent: true };
}
