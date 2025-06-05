'use client';
import React from 'react';
import Link from 'next/link'; // Import Next.js Link for navigation
import { useRouter } from 'next/navigation'; // If programmatic navigation is needed

// This component simulates the initial public page.
const PublicHomePageContent: React.FC = () => {
  const router = useRouter();

  React.useEffect(() => {
    // Tailwind's base styles should apply font-family from tailwind.config.js to body.
    // document.body.classList.add('font-sans'); // This should be handled by global styles or layout
  }, []);

  // Handler for ERP Panel navigation - illustrating potential future use with router
  const handleNavigateToErp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // In a real scenario, you might check auth status before navigating
    // or let Next.js handle direct navigation if the link is simple.
    // For now, using router.push as an example.
    // A <Link href="/admin/dashboard"> would be simpler for direct navigation.
    alert("Navegación al panel ERP se implementará con enrutamiento y protección de rutas.");
    // router.push('/admin/dashboard'); // Example: Programmatic navigation
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Bienvenido a SubRed E-commerce
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Tu nueva tienda online y plataforma de gestión.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link // Use Next.js Link for client-side navigation
            href="/products" // Example: link to a future products page
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Explorar Productos
          </Link>
          <Link // Use Next.js Link
            href="/admin/dashboard" // Direct link to ERP panel
            className="text-sm font-semibold leading-6 text-foreground"
            // onClick={handleNavigateToErp} // onClick can be used for more complex logic if needed
          >
            Ir al Panel ERP <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default function HomePage() {
  return <PublicHomePageContent />;
}