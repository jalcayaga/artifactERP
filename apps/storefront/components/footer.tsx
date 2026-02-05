import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerSections = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Funciones', href: '/#features' },
      { label: 'Precios', href: '/#planes' },
      { label: 'Integraciones', href: '/#features' },
      { label: 'Seguridad', href: '/privacy' }
    ]
  },
  {
    title: 'Compañía',
    links: [
      { label: 'Nosotros', href: '/about' },
      { label: 'Contacto', href: '/#contacto' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/privacy' },
      { label: 'Términos', href: '/terms' }
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
    <footer className="relative pt-16 pb-8 text-neutral-200">
      {/* Background Gradient for readability without hard cut */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent -z-10" />

      {/* Top gradient glow */}
      <div className="absolute inset-x-0 top-[-120px] h-[220px] bg-[radial-gradient(circle,var(--color-brand),transparent_60%)] opacity-20 blur-3xl" />

      <div className="relative container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column - spans 2 columns on large screens */}
          <div className="space-y-6 lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E074]/20 via-[#00E074]/30 to-[#00E074]/60 shadow-lg shadow-[#00E074]/20 transition-transform group-hover:scale-105">
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
              <span className="text-lg font-bold text-white">
                Artifact Storefront
              </span>
            </Link>

            {/* Description */}
            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-all hover:border-[#00E074]/50 hover:bg-[#00E074]/10 hover:text-[#00E074]"
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
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white/90">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 transition-colors hover:text-[#00E074]"
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
        <div className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-neutral-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()}{' '}
            <span className="text-neutral-400">Artifact Storefront</span>. Todos los derechos
            reservados.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacidad
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
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
