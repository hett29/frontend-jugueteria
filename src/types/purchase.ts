import type { CartItem } from "../components/Cart";

export interface PurchaseItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Purchase {
  id: string;
  userId: string;
  createdAt: string;
  paymentMethod: string;
  items: PurchaseItem[];
  total: number;
}

export function createPurchaseItems(items: CartItem[]): PurchaseItem[] {
  return items.map(({ product, quantity }) => ({
    productId: product.id,
    name: product.nombre,
    price: product.precio,
    quantity,
  }));
}
