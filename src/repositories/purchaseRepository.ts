import { storageService } from "../services/storageService";
import type { DeliveryLocation, Purchase, PurchaseItem, PurchaseStatus } from "../types/purchase";

const PURCHASES_KEY = "app_purchases";

function getPurchases(): Purchase[] {
  return storageService.get<Purchase[]>(PURCHASES_KEY) ?? [];
}

export const purchaseRepository = {
  getAll(): Purchase[] {
    return getPurchases().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getByUserId(userId: string): Purchase[] {
    return this.getAll().filter((purchase) => purchase.userId === userId);
  },

  create(userId: string, items: PurchaseItem[], paymentMethod: string, deliveryLocation: DeliveryLocation): Purchase {
    const purchase: Purchase = {
      id: crypto.randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
      paymentMethod,
      items,
      deliveryLocation,
      status: "PENDIENTE",
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
    storageService.set(PURCHASES_KEY, [...getPurchases(), purchase]);
    return purchase;
  },

  updateStatus(id: string, status: PurchaseStatus): Purchase | null {
    let updatedPurchase: Purchase | null = null;
    const purchases = getPurchases().map((purchase) => {
      if (purchase.id !== id) return purchase;
      updatedPurchase = { ...purchase, status, statusUpdatedAt: new Date().toISOString() };
      return updatedPurchase;
    });
    if (updatedPurchase) storageService.set(PURCHASES_KEY, purchases);
    return updatedPurchase;
  },
};
