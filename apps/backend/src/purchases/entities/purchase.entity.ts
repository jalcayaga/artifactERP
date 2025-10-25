import { Purchase, PurchaseItem, Prisma } from '@prisma/client';

export class PurchaseEntity implements Purchase {
  id: string;
  companyId: string;
  purchaseDate: Date;
  status: string;
  subTotalAmount: Prisma.Decimal;
  totalVatAmount: Prisma.Decimal;
  grandTotal: Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date;
  items?: PurchaseItem[];
}

export class PurchaseItemEntity implements PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
  itemVatAmount: Prisma.Decimal;
  totalPriceWithVat: Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date;
}