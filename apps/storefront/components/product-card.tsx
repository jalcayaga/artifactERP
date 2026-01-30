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
    <Card className="group relative h-full overflow-hidden border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70">
      <CardHeader className="relative">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          Disponible
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardTitle className="line-clamp-2 text-lg text-slate-900">
          {product.name}
        </CardTitle>
        <p className="text-sm text-slate-500">
          {product.description ?? "Gestión completa de tu inventario y ventas."}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-slate-400">
            Desde
          </span>
          <p className="text-lg font-semibold text-slate-900">{formattedPrice}</p>
        </div>
        <Button
          variant="ghost"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Ver detalle
        </Button>
      </CardFooter>
      <Link href={`/products/${product.id}`} className="absolute inset-0">
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
