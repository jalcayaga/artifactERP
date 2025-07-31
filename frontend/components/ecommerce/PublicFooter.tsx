// frontend/components/ecommerce/PublicFooter.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image from next/image
import { FacebookIcon, InstagramIcon, XTwitterIcon, LinkedInIcon } from '@/components/Icons'; // Import social icons

const PublicFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Quiénes Somos', href: '/info/about' },
    { name: 'Contacto', href: '/info/contact' },
    { name: 'Política de Envío', href: '/info/shipping-policy' },
    { name: 'Política de Devoluciones', href: '/info/refund-policy' },
    // { name: 'Términos y Condiciones', href: '/info/terms' },
    // { name: 'Política de Privacidad', href: '/info/privacy' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: FacebookIcon },
    { name: 'Instagram', href: '#', icon: InstagramIcon },
    { name: 'X (Twitter)', href: '#', icon: XTwitterIcon },
    { name: 'LinkedIn', href: '#', icon: LinkedInIcon },
  ];

  return (
    <footer className="bg-card border-t border-border/50 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Company Info */}
          <div className="md:col-span-1 space-y-3 text-center md:text-left lg:col-span-1">
            <Link href="/" className="inline-flex items-center group mb-2">
              <Image 
                src="/logo.png" 
                alt="SubRed Logo" 
                width={40} // Adjusted size for footer
                height={40} // Adjusted size for footer
                className="h-10 w-10 text-primary transition-transform duration-300 group-hover:rotate-12" 
              />
              {/* Removed Text Spans for "SubRed" and "Tienda" */}
            </Link>
            <p className="text-sm text-muted-foreground">
              Tu fuente confiable para productos de seguridad y tecnología de vanguardia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold text-foreground mb-3 tracking-wide">Enlaces Rápidos</h3>
            <ul className="space-y-1.5">
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">Catálogo</Link></li>
              <li><Link href="/#servicios" className="text-sm text-muted-foreground hover:text-primary transition-colors">Servicios</Link></li>
              <li><Link href="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">Carrito</Link></li>
              <li><Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Acceso ERP</Link></li>
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="text-md font-semibold text-foreground mb-3 tracking-wide">Información</h3>
            <ul className="space-y-1.5">
              {footerLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact & Social */}
          <div>
            <h3 className="text-md font-semibold text-foreground mb-3 tracking-wide">Contacto</h3>
            <ul className="space-y-1.5">
                <li><p className="text-sm text-muted-foreground">Email: <a href="mailto:ventas@subred.cl" className="hover:text-primary transition-colors">ventas@subred.cl</a></p></li>
                <li><p className="text-sm text-muted-foreground">Teléfono: <a href="tel:+56935989392" className="hover:text-primary transition-colors">+56 9 3598 9392</a></p></li>
            </ul>
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-foreground mb-2">Síguenos en Redes</h4>
              <div className="flex space-x-3">
                {socialLinks.map(social => (
                  <a 
                    key={social.name} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} SubRed Soluciones. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Una solución de <span className="font-semibold">SubRed</span> <span className="font-semibold">Ingeniería</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;