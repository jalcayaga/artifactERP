import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from "@artifact/ui";
import { type Product } from "@/lib/storefront";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.[0] || "/placeholder.svg";
  const formattedPrice = formatPrice(product.price);

  return (
    <Card className="group relative h-full overflow-hidden border-0 bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/5 rounded-[24px]">
      <CardHeader className="relative p-0 overflow-hidden bg-transparent">
        <div className="relative aspect-square w-full overflow-hidden bg-[#f5f5f7]">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-contain p-8 transition duration-700 ease-in-out group-hover:scale-110"
          />
        </div>
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-slate-900 tracking-wide uppercase">
          Nuevo
        </span>
      </CardHeader>
      <CardContent className="space-y-4 px-8 pt-8 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-[17px] font-semibold text-[#1d1d1f] leading-snug">
            {product.name}
          </CardTitle>
          <p className="text-[13px] text-[#86868b] leading-relaxed line-clamp-2">
            {product.description ?? "Potencia tu negocio con la mejor tecnología."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t-0 bg-transparent px-8 pb-8 pt-2">
        <div>
          <p className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">{formattedPrice}</p>
        </div>
        <Button
          variant="default"
          className="rounded-full bg-[#0071e3] text-white hover:bg-[#0077ed] px-5 py-5 text-[13px] font-medium transition-transform active:scale-95"
        >
          Comprar
        </Button>
      </CardFooter>
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">Ver {product.name}</span>
      </Link>
    </Card>
  );
}

function formatPrice(price: number) {
  try {
    return `$${price.toLocaleString("es-CL")}`;
  } catch {
    return `$${price}`;
  }
}
