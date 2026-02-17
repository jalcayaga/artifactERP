export interface Product {
  id: string;
  name: string;
  description?: string;
  images: string[];
  price: number;
  unitPrice?: number;
  category?: string;
  sku?: string;
  handle: string;
  thumbnail: string;
  currency: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
