// frontend/app/(public)/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next Image
import { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import FeaturedOfferCard from '@/components/ecommerce/FeaturedOfferCard'; 
import { ProductService } from '@/lib/services/productService'; 
import {
  ShieldCheckIcon,
  HomeIcon,
  VideoCameraIcon, 
  TagIcon,
  PackageIcon, // Add PackageIcon
  HeadphonesIcon, // Add HeadphonesIcon
  ChatBubbleLeftEllipsisIcon,
  ArrowRightIcon,
  CubeIcon,
  EyeIcon,
  WrenchScrewdriverIcon, 
  CogIcon, 
} from '@/components/Icons';
import { formatCurrencyChilean } from '@/lib/utils';


interface ProductCardDisplayProps {
  product: Product & { discountPercent?: number; oldPrice?: number };
}

const ProductCardDisplay: React.FC<ProductCardDisplayProps> = ({ product }) => {
  const KNOWN_BRANDS = ["DAHUA", "HIKVISION", "EZVIZ", "TRIMERX", "LEVITON", "SUBRED", "IMOU"];
  let displayBrand = "";
  const nameParts = (product.name || "").split(" ");
  if (nameParts.length > 0) {
    const firstWordUpper = nameParts[0].toUpperCase();
    const matchedBrand = KNOWN_BRANDS.find(b => firstWordUpper.startsWith(b) || firstWordUpper === b);
      if (matchedBrand) {
      displayBrand = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
    }
  }


  return (
    <div className="w-full sm:w-64 md:w-72 flex-shrink-0">
      <Link href={`/products/${product.id}`} className="group block h-full">
        <Card className="overflow-hidden shadow-md hover:shadow-lg dark:hover:shadow-primary/20 transition-all duration-300 h-full flex flex-col border border-border bg-card relative">
          {product.discountPercent && (
            <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-sm z-10">
              -{product.discountPercent}%
            </div>
          )}
          <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name || 'Imagen de producto'}
                fill
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" 
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                <CubeIcon className="w-16 h-16 text-muted-foreground opacity-40" />
              </div>
            )}
          </div>
          <CardContent className="p-3 flex flex-col flex-grow justify-between">
            <div> {/* Top group for info */}
              {displayBrand && <p className="text-xs text-muted-foreground mb-0.5">{displayBrand}</p>}
              <h3 
                className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight" 
                title={product.name || "Nombre no disponible"}
                style={{ minHeight: '2.5em' }} // Ensure space for two lines
              >
                {product.name || "Nombre no disponible"}
              </h3>
              {product.sku && <p className="text-xs text-muted-foreground mt-0.5 mb-1">Modelo: {product.sku}</p>}
            </div>
            
            <div className="mt-1"> {/* Pricing and button group */}
              {product.oldPrice && product.oldPrice > product.price && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatCurrencyChilean(product.oldPrice)}
                </p>
              )}
              <p className="text-lg font-bold text-primary">
                {formatCurrencyChilean(product.price)}
              </p>
              <button 
                className="mt-2 w-full bg-primary hover:bg-primary/90 text-neutral-900 text-xs font-semibold py-2.5 rounded-md transition-colors"
                onClick={(e) => { e.preventDefault(); alert('Agregar al carro: Próximamente');}} // Placeholder action
              >
                Agregar al carro
              </button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};


const CategoryLinkItem: React.FC<{ href: string; icon: React.FC<{className?:string}>; label: string }> = ({ href, icon: Icon, label }) => (
    <Link href={href} className="flex-shrink-0 w-36 sm:w-40">
        <Card className="bg-card hover:bg-accent dark:bg-slate-800 dark:hover:bg-slate-700/80 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center h-full border border-border">
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-2" />
            <span className="text-xs sm:text-sm font-medium text-foreground">{label}</span>
        </Card>
    </Link>
);

// Placeholder data for "Ofertas y Lanzamientos" with reliable placehold.co URLs
const ps5OfferNew = {
  id: 'ps5-oferta-new',
  imageUrl: 'https://placehold.co/300x400/000000/FFFFFF?text=PS5+Oferta',
  imageAlt: 'Oferta Consola PlayStation 5',
  ctaLink: '/products/placeholder-ps5',
};

const asusOfferNew = {
  id: 'asus-oferta-new',
  imageUrl: 'https://placehold.co/640x360/1A202C/FFFFFF?text=ASUS+Zenbook',
  imageAlt: 'Oferta ASUS Zenbook 14 OLED',
  ctaLink: '/products/placeholder-asus',
};

const zteSmartphoneOfferNew = {
  id: 'zte-oferta-new',
  imageUrl: 'https://placehold.co/700x350/D53F8C/FFFFFF?text=ZTE+Nubia',
  imageAlt: 'Oferta Smartphone ZTE Nubia Neo2',
  ctaLink: '/products/placeholder-zte',
};

const gearMonitorsBannerNew = {
  id: 'gear-monitors-banner-new',
  imageUrl: 'https://placehold.co/950x250/2D3748/FFFFFF?text=Monitores+Gear',
  imageAlt: 'Promoción Monitores Gear para trabajar o jugar',
  ctaLink: '/products/category/monitors',
};

const headphonesOfferNew = {
  id: 'headphones-oferta-new',
  imageUrl: 'https://placehold.co/400x400/C53030/FFFFFF?text=HyperX',
  imageAlt: 'Oferta Audífonos Gamer HyperX',
  ctaLink: '/products/placeholder-headphones',
};

const cameraOfferNew = {
  id: 'camera-oferta-new',
  imageUrl: 'https://placehold.co/400x400/4A5568/FFFFFF?text=Canon+Reflex',
  imageAlt: 'Oferta Cámara Reflex Canon',
  ctaLink: '/products/placeholder-camera',
};


const PublicHomePage: React.FC = () => {
  const [alarmProducts, setAlarmProducts] = useState<Product[]>([]);
  const [isLoadingAlarms, setIsLoadingAlarms] = useState(true);
  const [alarmsError, setAlarmsError] = useState<string | null>(null);
  const [accesoriesProducts, setAccesoriesProducts] = useState<Product[]>([]);
  const [accesoriesError, setAccesoriesError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAlarmProducts = async () => {
      setIsLoadingAlarms(true);
      setAlarmsError(null);
      try {
        const alarmCategoryResponse = await ProductService.getPublishedProducts(1, 5, 'Alarmas');
        let productsToDisplay = alarmCategoryResponse.data;

        if (!productsToDisplay || productsToDisplay.length === 0) {
            const fallbackResponse = await ProductService.getPublishedProducts(1, 5); // Fetch any 5 products as fallback
            productsToDisplay = fallbackResponse.data;
        }
        
        if (!productsToDisplay || productsToDisplay.length === 0) {
          setAlarmsError('No hay productos disponibles por el momento.');
          setAlarmProducts([]);
        } else {
          const productsWithDemoOffer = productsToDisplay.map((p, index) => {
            if (index % 2 === 0 && p.price > 50000 && p.productType === 'Producto') { // Add offer to some products
              return {
                ...p,
                oldPrice: p.price * 1.25, 
                discountPercent: 20, 
              };
            }
            return p;
          });
          setAlarmProducts(productsWithDemoOffer);
        }

      } catch (error) {
        console.error("Error fetching alarm products:", error);
        setAlarmsError('No se pudieron cargar los productos.');
        setAlarmProducts([]);
      } finally {
        setIsLoadingAlarms(false);
      }
    };
    fetchAlarmProducts();
  }, []);

  useEffect(() => {
    const fetchAccesoriesProducts = async () => {
      setIsLoadingAlarms(true);
      setAlarmsError(null);
      try {
        const accesoriesCategoryResponse = await ProductService.getPublishedProducts(1, 5, 'Accesorios');
        let productsToDisplay = accesoriesCategoryResponse.data;
        
        if (!productsToDisplay || productsToDisplay.length === 0) {
          setAccesoriesError('No hay productos disponibles por el momento.');
          setAccesoriesProducts([]);
        } else {
          setAccesoriesProducts(productsToDisplay);
        }

      } catch (error) {
        console.error("Error fetching accesories products:", error);
        setAccesoriesError('No se pudieron cargar los productos.');
        setAccesoriesProducts([]);
      } finally {
        setIsLoadingAlarms(false);
      }
    };
    fetchAccesoriesProducts();
  }, []);
  
  const categories = [
    { label: 'Alarmas', icon: HomeIcon, href: '/products?category=Alarmas' },
    { label: 'Cámaras', icon: VideoCameraIcon, href: '/products?category=Cámaras' },
    { label: 'Seguridad', icon: ShieldCheckIcon, href: '/products?category=Seguridad' },
    { label: 'Kits', icon: PackageIcon, href: '/products?category=Kits' },
    { label: 'Audio y Video', icon: HeadphonesIcon, href: '/products?category=Audio y Video' },
  ];

  const categoriesSecondary = [
    { label: 'Accesorios', icon: TagIcon, href: '/products?category=Accesorios' },
    { label: 'Contacto', icon: ChatBubbleLeftEllipsisIcon, href: '/info/contact' },
  ];
  
  const brands = [
    { name: 'EZVIZ', logoUrl: 'https://placehold.co/120x40/F7FAFC/31343C?text=EZVIZ' },
    { name: 'SubRed Secure', logoUrl: '/logo.png', alt: 'SubRed Logo' }, 
    { name: 'HIKVISION', logoUrl: 'https://placehold.co/120x40/F7FAFC/31343C?text=HIKVISION' },
    { name: 'HiLook', logoUrl: 'https://placehold.co/120x40/F7FAFC/31343C?text=HiLook' },
    { name: 'Trimerx', logoUrl: 'https://placehold.co/120x40/F7FAFC/31343C?text=Trimerx' },
    { name: 'Leviton', logoUrl: 'https://placehold.co/120x40/F7FAFC/31343C?text=Leviton' },
  ];


  return (
    <div className="bg-background text-foreground">
      {/* Modified Static Hero Section - Reduced Height and Content Size */}
      <section 
        className="relative w-full h-[45vh] sm:h-[50vh] md:h-[55vh] bg-cover bg-center flex items-center justify-center text-center"
        style={{ backgroundImage: `url(https://placehold.co/1600x600/31343C/FFFFFF?text=SubRed+Soluciones)` }} // Changed to reliable placeholder
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 bg-black/65"></div> {/* Dark overlay */}
        <div className="relative z-10 p-4 sm:p-8 text-white max-w-2xl">
          <h1 id="hero-title" className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3 filter drop-shadow-md">
            Tecnología de vanguardia para tu seguridad
          </h1>
          <p className="text-sm sm:text-md text-slate-200 mb-4 sm:mb-6 max-w-lg mx-auto filter drop-shadow-sm">
            Descubre soluciones integrales en cámaras, alarmas y sistemas de protección avanzados. Innovación y confianza a tu alcance.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-neutral-900 font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base transform hover:scale-105"
          >
            Explorar Productos <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Category Links Section - Enhanced */}
      <section className="py-8 sm:py-12 bg-muted/30 border-b border-border">

        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-4 sm:mb-6">
            Explora Nuestras Categorías
          </h2>
          <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 justify-start sm:justify-center scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
            {categories.map(cat => (
              <CategoryLinkItem key={cat.label} href={cat.href} icon={cat.icon} label={cat.label} />
            ))}
          </div>
        </div>
        <div className="container mx-auto px-4">
        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 justify-start sm:justify-center scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
            {categoriesSecondary.map(cat => (
              <CategoryLinkItem key={cat.label} href={cat.href} icon={cat.icon} label={cat.label} />
            ))}
          </div>
        </div>
      </section>
      
      {/* ALARMAS Product Showcase */}
      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Alarmas</h2>
            {/* Link "Ver todas las alarmas" is now below the product cards */}
          </div>
          {isLoadingAlarms && <p className="text-center text-muted-foreground">Cargando alarmas...</p>}
          {alarmsError && <p className="text-center text-destructive">{alarmsError}</p>}
          {!isLoadingAlarms && !alarmsError && alarmProducts.length > 0 && (
           <div className="flex justify-center w-full">
            <div className="inline-flex items-stretch space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent max-w-full">
              {alarmProducts.map(product => (
                <ProductCardDisplay key={product.id} product={product} />
              ))}
            </div>
           </div>
          )}
           {!isLoadingAlarms && !alarmsError && alarmProducts.length === 0 && ( 
             <p className="text-center text-muted-foreground">No hay productos de alarmas disponibles en este momento.</p>
           )}
           {!isLoadingAlarms && !alarmsError && alarmProducts.length > 0 && (
            <div className="mt-6 text-right">
                <Link 
                    href="/products?category=Alarmas" 
                    className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors flex items-center justify-end"
                    aria-label="Ver todas las alarmas"
                >
                    Ver todas las alarmas <ArrowRightIcon className="w-4 h-4 ml-1.5" />
                </Link>
            </div>
           )}
        </div>
      </section>

      {/* ACCESORIOS Product Showcase */}
      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Accesorios</h2>
            {/* Link "Ver todas las alarmas" is now below the product cards */}
          </div>
          {isLoadingAlarms && <p className="text-center text-muted-foreground">Cargando Accesorios...</p>}
          {accesoriesError && <p className="text-center text-destructive">{accesoriesError}</p>}
          {!isLoadingAlarms && !accesoriesError && accesoriesProducts.length > 0 && (
           <div className="flex justify-center w-full">
            <div className="inline-flex items-stretch space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent max-w-full">
              {accesoriesProducts.map(product => (
                <ProductCardDisplay key={product.id} product={product} />
              ))}
            </div>
           </div>
          )}
           {!isLoadingAlarms && !accesoriesError && accesoriesProducts.length === 0 && ( 
             <p className="text-center text-muted-foreground">No hay productos de Accesorios disponibles en este momento.</p>
           )}
           {!isLoadingAlarms && !accesoriesError && accesoriesProducts.length > 0 && (
            <div className="mt-6 text-right">
                <Link 
                    href="/products?category=Accesorios" 
                    className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors flex items-center justify-end"
                    aria-label="Ver todas las alarmas"
                >
                    Ver todos los Accesorios <ArrowRightIcon className="w-4 h-4 ml-1.5" />
                </Link>
            </div>
           )}
      {/* ====== Updated "Por Qué Elegir SubRed" Section - Darker Background, Improved Icons ====== */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-lime-700 via-teal-700 to-cyan-700 dark:from-lime-800 dark:via-teal-800 dark:to-cyan-800">
        <div className="container mx-auto px-4 text-center text-white">
          {/* Removed h2 and p title/subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8"> {/* Added pt-8 for spacing after title removal */}
            {/* Item 1: Calidad Superior */}
            <div className="flex flex-col items-center p-2">
              <div className="bg-black/25 dark:bg-black/40 p-4 rounded-full mb-4 inline-block shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg dark:hover:shadow-primary/20">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Superior</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Productos de marcas líderes y soluciones de seguridad probadas y confiables.
              </p>
            </div>
            {/* Item 2: Asesoría Personalizada */}
            <div className="flex flex-col items-center p-2">
              <div className="bg-black/25 dark:bg-black/40 p-4 rounded-full mb-4 inline-block shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg dark:hover:shadow-primary/20">
                <ChatBubbleLeftEllipsisIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Asesoría Personalizada</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Te guiamos para encontrar la tecnología ideal para tu protección y necesidades.
              </p>
            </div>
            {/* Item 3: Instalación Experta */}
            <div className="flex flex-col items-center p-2">
              <div className="bg-black/25 dark:bg-black/40 p-4 rounded-full mb-4 inline-block shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg dark:hover:shadow-primary/20">
                <WrenchScrewdriverIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instalación Experta</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Servicio técnico certificado para un funcionamiento impecable y eficiente.
              </p>
            </div>
            {/* Item 4: Soporte Confiable */}
            <div className="flex flex-col items-center p-2">
              <div className="bg-black/25 dark:bg-black/40 p-4 rounded-full mb-4 inline-block shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg dark:hover:shadow-primary/20">
                <CogIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Soporte Confiable</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Asistencia continua para garantizar tu tranquilidad y la máxima satisfacción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======== Sección: Ofertas y Lanzamientos - Actualizada con proporciones ======== */}
      <section className="py-6 sm:py-8 md:py-10 bg-background">
        <div className="container mx-auto px-4">
          {/* Título de la sección */}
          <div className="bg-primary text-primary-foreground text-center py-3 sm:py-4 mb-6 sm:mb-8 rounded-md shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-wide">Ofertas y lanzamientos</h2>
          </div>

          {/* Grid de Ofertas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {/* Row 1 */}
            <div className="md:col-span-3 aspect-[3/4]"> {/* PS5: Portrait */}
              <FeaturedOfferCard product={ps5OfferNew} />
            </div>
            <div className="md:col-span-4 aspect-[16/9]"> {/* ASUS: Landscape 16:9 */}
              <FeaturedOfferCard product={asusOfferNew} />
            </div>
            <div className="md:col-span-5 aspect-[2/1]"> {/* ZTE Smartphone: Wide Landscape 2:1 */}
              <FeaturedOfferCard product={zteSmartphoneOfferNew} />
            </div>

            {/* Row 2 */}
            <div className="md:col-span-12 aspect-[19/5]"> {/* Gear Monitors Banner: Very Wide Panoramic */}
              <FeaturedOfferCard product={gearMonitorsBannerNew} />
            </div>
            
            {/* Row 3 */}
            <div className="md:col-span-3 aspect-square"> {/* Headphones: Square */}
              <FeaturedOfferCard product={headphonesOfferNew} />
            </div>
            <div className="md:col-span-3 aspect-square"> {/* Camera: Square */}
              <FeaturedOfferCard product={cameraOfferNew} />
            </div>
            {/* Las 6 columnas restantes de esta fila quedan vacías para replicar el espaciado de la imagen */}
          </div>

        </div>
      </section>
      
      {/* MARCAS Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-muted/30 border-t border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">Marcas Destacadas</h2>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 sm:gap-x-12">
            {brands.map(brand => (
              <Link 
                key={brand.name} 
                href={`/products?brand=${brand.name.toLowerCase()}`} 
                className="opacity-70 hover:opacity-100 transition-opacity duration-200 filter dark:invert" 
                title={brand.name}
              >
                {brand.name === 'SubRed Secure' ? (
                   <Image // Use next/image for the SubRed logo
                     src={brand.logoUrl}
                     alt={brand.alt || `${brand.name} Logo`}
                     width={120} // Provide appropriate width
                     height={40} // Provide appropriate height
                     className={`h-8 sm:h-10 object-contain ${brand.name === 'SubRed Secure' ? 'dark:!invert-0' : ''}`}
                   />
                ) : (
                  <img // Keep <img> for external or placeholder logos
                    src={brand.logoUrl} 
                    alt={brand.alt || `${brand.name} Logo`} 
                    className={`h-8 sm:h-10 ${brand.name === 'SubRed Secure' ? 'dark:!invert-0' : ''}`} 
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicHomePage;