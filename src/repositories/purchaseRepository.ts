import { storageService } from "../services/storageService";
import type { Purchase, PurchaseItem } from "../types/purchase";

const PURCHASES_KEY = "app_purchases";

function getPurchases(): Purchase[] {
  return storageService.get<Purchase[]>(PURCHASES_KEY) ?? [];
}

export const purchaseRepository = {
  getByUserId(userId: string): Purchase[] {
    return getPurchases()
      .filter((purchase) => purchase.userId === userId)
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  },

  create(userId: string, items: PurchaseItem[], paymentMethod: string): Purchase {
    const purchase: Purchase = {
      id: crypto.randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
      paymentMethod,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    storageService.set(PURCHASES_KEY, [...getPurchases(), purchase]);
    return purchase;
  },
};
