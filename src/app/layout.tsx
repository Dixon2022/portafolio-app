import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portafolio Profesional",
  description: "Portafolio personal con panel de administracion privado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const clean = function () {
                    const elements = document.querySelectorAll('[bis_skin_checked]');
                    for (const el of elements) {
                      el.removeAttribute('bis_skin_checked');
                    }

                    if (document.body) {
                      const attrs = Array.from(document.body.attributes).map(function (a) {
                        return a.name;
                      });

                      for (const name of attrs) {
                        if (name.indexOf('__processed_') === 0) {
                          document.body.removeAttribute(name);
                        }
                      }
                    }
                  };

                  clean();
                  const observer = new MutationObserver(function () {
                    clean();
                  });

                  observer.observe(document.documentElement, {
                    subtree: true,
                    childList: true,
                    attributes: true,
                    attributeFilter: ['bis_skin_checked'],
                  });

                  document.addEventListener('DOMContentLoaded', clean, { once: true });
                  window.addEventListener('load', clean, { once: true });
                  setTimeout(clean, 0);
                  setTimeout(clean, 50);
                  setTimeout(clean, 200);
                } catch (_e) {
                  // Ignore extension cleanup failures.
                }
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
