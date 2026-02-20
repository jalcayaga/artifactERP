import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerSections = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Funciones', href: '/#features' },
      { label: 'Precios', href: '/#planes' },
      { label: 'Integraciones', href: '/#features' },
      { label: 'Seguridad', href: '/info#privacy' }
    ]
  },
  {
    title: 'Compañía',
    links: [
      { label: 'Nosotros', href: '/info#about' },
      { label: 'Contacto', href: '/#contacto' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/info#privacy' },
      { label: 'Términos', href: '/info#terms' }
    ]
  }
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' }
];

export function Footer() {
  return (
    <footer className="relative pt-16 pb-8 text-[rgb(var(--text-secondary))]">
      {/* Background Gradient for readability without hard cut */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--bg-primary))] via-[rgb(var(--bg-primary))]/60 to-transparent -z-10" />

      {/* Top gradient glow */}
      <div className="absolute inset-x-0 top-[-120px] h-[220px] bg-[radial-gradient(circle,rgba(var(--brand-rgb),0.3),transparent_60%)] opacity-20" />

      <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid gap-12 border-b border-[rgb(var(--border-color))] pb-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column - spans 2 columns on large screens */}
          <div className="space-y-6 lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E074]/20 via-[#00E074]/30 to-[#00E074]/60 transition-transform group-hover:scale-105">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-[rgb(var(--text-primary))]">
                Artifact Storefront
              </span>
            </Link>

            {/* Description */}
            <p className="max-w-sm text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
              SaaS para pymes chilenas que necesitan vender online, controlar su operación y emitir DTE sin estrés.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-secondary))] transition-all hover:border-brand/50 hover:bg-brand/10 hover:text-brand"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[rgb(var(--text-primary))]/90">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[rgb(var(--text-secondary))] transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-[rgb(var(--text-secondary))] sm:flex-row">
          <p>
            © {new Date().getFullYear()}{' '}
            <span className="text-[rgb(var(--text-secondary))]">Artifact Storefront</span>. Todos los derechos
            reservados.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/info#privacy" className="transition-colors hover:text-[rgb(var(--text-primary))]">
              Privacidad
            </Link>
            <Link href="/info#terms" className="transition-colors hover:text-[rgb(var(--text-primary))]">
              Términos
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E074]/50 to-transparent" />
    </footer>
  );
}
