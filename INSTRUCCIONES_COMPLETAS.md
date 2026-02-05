# INSTRUCCIONES PARA AI IDE (Cursor/Windsurf)

## CONTEXTO
Tengo un proyecto Next.js 14 con Tailwind CSS. Necesito reemplazar los componentes actuales con versiones mejoradas y premium con diseño "Cyberpunk Clean SaaS".

## CONFIGURACIÓN BASE

### 1. tailwind.config.ts
Reemplaza el archivo actual con:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#00E074', // Neon Green
        primary: '#00E074',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 2. app/globals.css o styles/globals.css
Reemplaza el archivo actual con:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-brand: #00E074;
  --color-text: #FFFFFF;
  --radius: 0.5rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  @apply bg-black text-white antialiased;
}

::selection {
  @apply bg-[#00E074] text-black;
}

::-moz-selection {
  @apply bg-[#00E074] text-black;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-neutral-950;
}

::-webkit-scrollbar-thumb {
  @apply bg-neutral-800 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-[#00E074];
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### 3. app/layout.tsx
Actualiza el layout principal:

```typescript
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Artifact Storefront',
  description: 'Tu ecommerce con ERP y facturación electrónica para el SII',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="es" 
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      style={{
        '--color-brand': '#00E074',
        '--color-text': '#FFFFFF',
        '--radius': '0.5rem',
      } as React.CSSProperties}
    >
      <body className="min-h-screen bg-black text-white antialiased selection:bg-[#00E074] selection:text-black">
        {children}
      </body>
    </html>
  );
}
```

## COMPONENTES

### 4. components/marketing/Hero.tsx
Crea o reemplaza con:

```typescript
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-neutral-950">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />
      
      {/* Glow orbs */}
      <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#00E074]/20 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-[#00E074]/10 blur-[100px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[90vh] items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00E074]/20 bg-[#00E074]/5 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[#00E074]" />
              <span className="text-sm font-medium text-white/90">
                Plataforma Todo-en-Uno para MicroPyMEs
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Gestiona, Vende y{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-[#00E074] via-emerald-400 to-[#00E074] bg-clip-text text-transparent">
                    Crece
                  </span>
                  <span className="absolute -inset-1 -z-10 blur-xl bg-gradient-to-r from-[#00E074]/50 to-emerald-400/50" />
                </span>{' '}
                con Artifact
              </h1>
              
              <p className="max-w-xl text-lg leading-relaxed text-neutral-400 sm:text-xl">
                La plataforma todo en uno para pymes chilenas. E-commerce, ERP y Facturación Electrónica en un solo lugar.
              </p>
            </div>

            {/* Stats terminal */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 p-6 backdrop-blur-sm transition-all hover:border-[#00E074]/30">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-[#00E074]">+40%</div>
                  <div className="text-sm text-neutral-500">Ventas</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-[#00E074]">-15h</div>
                  <div className="text-sm text-neutral-500">Gestión</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-[#00E074]">100%</div>
                  <div className="text-sm text-neutral-500">Control</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="#planes">
                <button className="group relative overflow-hidden rounded-full bg-[#00E074] px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,224,116,0.5)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Ver Planes
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#00E074] to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </Link>
              
              <Link href="#contacto">
                <button className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-[#00E074]/50 hover:bg-white/10">
                  Diagnóstico Gratis
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#00E074]" />
                <span>Integración con SII</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#00E074]" />
                <span>Sin contratos largos</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#00E074]" />
                <span>Soporte en español</span>
              </div>
            </div>
          </div>

          {/* Right: Visual Element */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square">
              {/* Floating card */}
              <div className="absolute right-0 top-1/4 z-10 w-80 animate-float rounded-2xl border border-white/10 bg-neutral-900/80 p-6 shadow-2xl shadow-[#00E074]/20 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00E074]/10">
                    <svg
                      className="h-6 w-6 text-[#00E074]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Tu Negocio Online</h3>
                    <p className="text-sm text-neutral-400">Operación profesional</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                    <span className="text-sm text-neutral-300">Ofertas</span>
                    <span className="text-sm font-medium text-[#00E074]">Limitadas</span>
                  </div>
                  
                  <Link
                    href="/products"
                    className="flex items-center justify-between text-sm text-[#00E074] transition-colors hover:text-emerald-400"
                  >
                    <span>Ir a la tienda</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Decorative grid */}
              <div className="absolute inset-0 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent" />
              <div className="absolute left-1/4 top-1/2 h-64 w-64 rounded-full bg-[#00E074]/20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
```

### 5. components/marketing/Services.tsx
Crea o reemplaza con:

```typescript
import { 
  Palette, 
  Users, 
  MessageSquare, 
  Target, 
  ShoppingCart, 
  TrendingUp 
} from 'lucide-react';

const services = [
  {
    phase: 'Fase 1',
    title: 'Identidad & Presencia',
    description: 'Creamos tu marca desde cero: logo, colores, tipografía y página web profesional que refleje la esencia de tu negocio.',
    icon: Palette,
    features: [
      'Diseño de logo e identidad visual',
      'Página web responsive optimizada',
      'Dominio y hosting incluidos',
      'Manual de marca completo'
    ],
    accent: 'from-[#00E074]/20 to-emerald-500/20'
  },
  {
    phase: 'Fase 2',
    title: 'Redes & Community',
    description: 'Construimos y administramos tu presencia en redes sociales. Creamos contenido que conecta y convierte seguidores en clientes.',
    icon: Users,
    features: [
      'Creación de perfiles optimizados',
      'Gestión integral como CM',
      'Contenido visual y copywriting',
      'Reportes de crecimiento mensual'
    ],
    accent: 'from-cyan-500/20 to-[#00E074]/20'
  },
  {
    phase: 'Fase 3',
    title: 'CRM & Gestión',
    description: 'Con Chatwoot centralizamos todas las conversaciones. Cada mensaje de Instagram, Facebook o WhatsApp se gestiona profesionalmente.',
    icon: MessageSquare,
    features: [
      'Bandeja unificada de mensajes',
      'Historial completo de clientes',
      'Respuestas automáticas',
      'Métricas de atención'
    ],
    accent: 'from-purple-500/20 to-[#00E074]/20'
  },
  {
    phase: 'Fase 4',
    title: 'Marketing & Ads',
    description: 'Campañas publicitarias estratégicas en Google y Meta que generan clientes reales. No gastes plata a ciegas.',
    icon: Target,
    features: [
      'Ads en Facebook e Instagram',
      'Google Ads (Búsqueda Local)',
      'Email marketing automatizado',
      'Análisis de ROI'
    ],
    accent: 'from-orange-500/20 to-[#00E074]/20'
  },
  {
    phase: 'Fase 5',
    title: 'E-commerce & POS',
    description: 'Tu tienda online que también funciona como POS en tu local. Vendes online y presencial desde la misma plataforma.',
    icon: ShoppingCart,
    features: [
      'E-commerce integrado al SII',
      'POS para ventas en local',
      'Inventario sincronizado',
      'Facturación electrónica'
    ],
    accent: 'from-rose-500/20 to-[#00E074]/20'
  },
  {
    phase: 'Fase 6',
    title: 'Escalamiento',
    description: 'Automatizamos todo lo repetitivo para que te enfoques en crecer. Dashboard único para controlar todo tu negocio.',
    icon: TrendingUp,
    features: [
      'Marketing automatizado',
      'Dashboard unificado',
      'Reportes predictivos',
      'Escalamiento eficiente'
    ],
    accent: 'from-blue-500/20 to-[#00E074]/20'
  }
];

export default function Services() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-24" id="servicios">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute right-0 top-0 h-[600px] w-[600px] bg-gradient-to-l from-[#00E074]/10 to-transparent blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00E074]/30 bg-[#00E074]/10 px-4 py-2 ring-1 ring-[#00E074]/20">
            <span className="text-sm font-medium text-[#00E074]">Servicios</span>
          </div>
          
          <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            El camino completo hacia el{' '}
            <span className="bg-gradient-to-r from-[#00E074] to-emerald-400 bg-clip-text text-transparent">
              éxito digital
            </span>
          </h2>
          
          <p className="text-lg leading-relaxed text-neutral-400">
            No solo te damos herramientas. Te acompañamos desde que tienes solo una idea hasta que eres el referente digital de tu rubro.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#00E074]/50 hover:bg-neutral-900/80 hover:shadow-xl hover:shadow-[#00E074]/10"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-30`} />
                
                {/* Glow effect */}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#00E074]/0 via-[#00E074]/0 to-[#00E074]/0 opacity-0 blur transition-opacity duration-500 group-hover:from-[#00E074]/20 group-hover:via-[#00E074]/10 group-hover:to-transparent group-hover:opacity-100" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00E074]/10 text-[#00E074] ring-1 ring-[#00E074]/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#00E074]/20 group-hover:shadow-lg group-hover:shadow-[#00E074]/50">
                    <Icon className="h-8 w-8" strokeWidth={1.5} />
                  </div>

                  {/* Phase badge */}
                  <div className="mb-4 inline-block rounded-full bg-[#00E074]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00E074] ring-1 ring-[#00E074]/30">
                    {service.phase}
                  </div>

                  {/* Title */}
                  <h3 className="mb-4 text-2xl font-bold text-white transition-colors group-hover:text-[#00E074]">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-6 text-neutral-400 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00E074] shadow-sm shadow-[#00E074]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-[#00E074]/20 bg-gradient-to-br from-[#00E074]/10 via-neutral-900/80 to-neutral-900/80 p-10 text-center backdrop-blur-sm shadow-2xl shadow-[#00E074]/10">
          <h3 className="mb-4 text-3xl font-bold text-white">
            ¿Listo para empezar tu transformación digital?
          </h3>
          <p className="mb-8 text-lg text-neutral-400">
            Agenda un diagnóstico gratuito y descubre qué fase necesita tu negocio
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 rounded-full bg-[#00E074] px-10 py-5 text-lg font-bold text-black shadow-lg shadow-[#00E074]/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#00E074]/60"
          >
            Agendar Diagnóstico Gratis
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
```

### 6. components/marketing/Pricing.tsx
Crea o reemplaza con:

```typescript
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Plan Despega',
    price: '$150.000',
    period: '/ mes',
    description: 'La base para lanzar tu marca al mundo digital con una imagen profesional.',
    features: [
      'Identidad de Marca Completa',
      'Página Web Profesional',
      'Hosting y Dominio .CL',
      'Manual de marca completo',
      'Soporte por email'
    ],
    cta: 'Comenzar Ahora',
    href: '/registro?plan=despega',
    popular: false
  },
  {
    name: 'Plan Consolida',
    price: '$350.000',
    period: '/ mes',
    description: 'Para negocios que buscan crecer, atraer clientes y gestionar su comunidad.',
    features: [
      'Todo lo del Plan Despega',
      'Community Manager Dedicado',
      'Campañas en Google y Meta',
      'CRM integrado (Chatwoot)',
      'Reportes mensuales detallados',
      'Soporte prioritario'
    ],
    cta: 'Elegir Plan',
    href: '/registro?plan=consolida',
    popular: true
  },
  {
    name: 'Plan Lidera',
    price: 'A Medida',
    period: '',
    description: 'La solución completa para ser líder digital con e-commerce y automatización.',
    features: [
      'Todo lo del Plan Consolida',
      'E-commerce y POS Integrado',
      'Automatización de Marketing',
      'Facturación electrónica SII',
      'Dashboard unificado',
      'Soporte 24/7'
    ],
    cta: 'Cotizar',
    href: '/registro?plan=lidera',
    popular: false
  }
];

export default function Pricing() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-24" id="planes">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,224,116,0.05),transparent_70%)]" />
      <div className="absolute left-0 top-1/4 h-[500px] w-[500px] bg-gradient-to-r from-[#00E074]/10 to-transparent blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00E074]/20 bg-[#00E074]/5 px-4 py-2">
            <Sparkles className="h-4 w-4 text-[#00E074]" />
            <span className="text-sm font-medium text-[#00E074]">Planes</span>
          </div>

          <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            Planes diseñados para{' '}
            <span className="bg-gradient-to-r from-[#00E074] to-emerald-400 bg-clip-text text-transparent">
              cada etapa
            </span>
          </h2>

          <p className="text-lg leading-relaxed text-neutral-400">
            Elige el plan que se adapte a tu MicroPyME. Todos incluyen acompañamiento experto.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;
            
            return (
              <div
                key={index}
                className={`relative flex flex-col rounded-3xl border backdrop-blur-sm transition-all duration-500 ${
                  isPopular
                    ? 'scale-100 border-[#00E074]/30 bg-neutral-900 shadow-2xl shadow-[#00E074]/20 lg:scale-105 lg:-translate-y-4'
                    : 'border-white/5 bg-neutral-900/30 hover:border-[#00E074]/20 hover:bg-neutral-900/50'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00E074] to-emerald-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-[#00E074]/50">
                      <Sparkles className="h-3.5 w-3.5" />
                      Más Popular
                    </div>
                  </div>
                )}

                {/* Glow effect for popular */}
                {isPopular && (
                  <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#00E074]/30 via-[#00E074]/10 to-[#00E074]/30 opacity-50 blur" />
                )}

                <div className={`relative flex flex-col p-8 ${isPopular ? 'pt-10' : ''}`}>
                  {/* Plan Name */}
                  <h3 className="mb-2 text-xl font-bold text-white">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-neutral-500">{plan.period}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mb-8 text-sm leading-relaxed text-neutral-400">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="mb-8 flex-grow space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          isPopular ? 'bg-[#00E074]/20' : 'bg-white/5'
                        }`}>
                          <Check className={`h-3.5 w-3.5 ${isPopular ? 'text-[#00E074]' : 'text-[#00E074]'}`} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href={plan.href}>
                    {isPopular ? (
                      <button className="group relative w-full overflow-hidden rounded-full bg-[#00E074] py-4 text-center font-bold text-black shadow-lg shadow-[#00E074]/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#00E074]/50">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {plan.cta}
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-[#00E074] opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    ) : (
                      <button className="group w-full rounded-full border border-white/10 bg-white/5 py-4 text-center font-medium text-white transition-all hover:border-[#00E074]/50 hover:bg-white/10">
                        <span className="flex items-center justify-center gap-2">
                          {plan.cta}
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </button>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto mt-16 max-w-4xl rounded-3xl border border-[#00E074]/10 bg-gradient-to-r from-neutral-900/50 via-neutral-900/30 to-neutral-900/50 p-8 text-center backdrop-blur-sm md:p-12">
          <div className="mb-6">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00E074]/10">
              <svg
                className="h-8 w-8 text-[#00E074]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">
              ¿No estás seguro qué plan elegir?
            </h3>
            <p className="text-neutral-400">
              Agenda una llamada de 15 minutos y te ayudamos a encontrar la mejor opción para tu negocio
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00E074] px-8 py-4 font-semibold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#00E074]/50"
            >
              Hablar con un Experto
              <ArrowRight className="h-5 w-5" />
            </a>
            
            <a
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-medium text-white transition-all hover:border-[#00E074]/50 hover:bg-white/10"
            >
              Ver Servicios Incluidos
            </a>
          </div>
        </div>

        {/* Trust indicator */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#00E074]" />
            <span>Sin permanencia</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#00E074]" />
            <span>Cancela cuando quieras</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#00E074]" />
            <span>Garantía de 30 días</span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 7. components/footer.tsx
Crea o reemplaza con:

```typescript
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerSections = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Funciones', href: '/features' },
      { label: 'Precios', href: '/pricing' },
      { label: 'Integraciones', href: '/integrations' },
      { label: 'Seguridad', href: '/security' }
    ]
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Documentación', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Guías', href: '/guides' },
      { label: 'Soporte', href: '/support' }
    ]
  },
  {
    title: 'Compañía',
    links: [
      { label: 'Nosotros', href: '/about' },
      { label: 'Contacto', href: '/contact' },
      { label: 'Carreras', href: '/careers' },
      { label: 'Prensa', href: '/press' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/privacy' },
      { label: 'Términos', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Status', href: '/status' }
    ]
  }
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' }
];

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-black text-neutral-200">
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
            <Link href="/status" className="transition-colors hover:text-white">
              Status
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E074]/50 to-transparent" />
    </footer>
  );
}
```

## INSTRUCCIONES PARA TU AI IDE

Copia todo este archivo y dale esta instrucción a tu AI IDE (Cursor/Windsurf):

```
Por favor, implementa todos estos cambios en mi proyecto:
1. Reemplaza tailwind.config.ts con la nueva configuración
2. Actualiza globals.css con los nuevos estilos base
3. Modifica layout.tsx con los estilos inline correctos
4. Crea/reemplaza Hero.tsx en components/marketing/
5. Crea/reemplaza Services.tsx en components/marketing/
6. Crea/reemplaza Pricing.tsx en components/marketing/
7. Crea/reemplaza footer.tsx en components/

Asegúrate de:
- Usar el color verde #00E074 en todos los componentes
- Fondos neutral-950 (negro sin tinte azul)
- Importar lucide-react para los iconos
- Mantener la estructura de carpetas actual
```

¡Listo! Con esto tu AI IDE implementará todo automáticamente.
