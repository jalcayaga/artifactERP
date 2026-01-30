import React from "react";
import Link from "next/link";
import { useTenant } from "@/hooks/use-tenant";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

const footerLinks = [
  {
    title: "Plataforma",
    links: [
      { label: "Funciones", href: "/features" },
      { label: "Precios", href: "/pricing" },
      { label: "Integraciones", href: "/integrations" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Documentación", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "Soporte", href: "/support" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { label: "Nosotros", href: "/about" },
      { label: "Contacto", href: "/contact" },
      { label: "Privacidad", href: "/privacy" },
    ],
  },
];

export function Footer() {
  const { tenant } = useTenant();
  const branding = tenant?.branding;
  const socialLinks = branding?.socialLinks as any;
  const storeName = tenant?.tenant?.name || "Artifact Storefront";

  return (
    <footer className="relative mt-20 overflow-hidden bg-slate-950 text-slate-200">
      <div className="absolute inset-x-0 top-[-120px] h-[220px] bg-[radial-gradient(circle,_rgba(99,102,241,0.35),_transparent_60%)] blur-3xl" />
      <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-4">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              {storeName}
            </span>
            <p className="text-sm text-slate-300/80">
              SaaS para pymes chilenas que necesitan vender online, controlar su operación y
              emitir DTE sin estrés.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {socialLinks?.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white/70">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-300 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {storeName}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-white">
              Términos
            </Link>
            <Link href="/status" className="hover:text-white">
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
