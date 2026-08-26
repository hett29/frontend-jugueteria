import type { User } from "../types/auth";
import type { Purchase } from "../types/purchase";
import "./Account.css";

interface AccountProps {
  user: User | null;
  purchases: Purchase[];
}

const paymentMethodLabels: Record<string, string> = {
  qr: "Pago con QR",
  card: "Tarjeta",
  cash: "Efectivo",
};

function Account({ user, purchases }: AccountProps) {
  if (!user) {
    return (
      <section className="account-section">
        <h2>Tu cuenta</h2>
        <p>Inicia sesión para consultar tus compras.</p>
      </section>
    );
  }

  return (
    <section className="account-section" aria-labelledby="account-title">
      <p className="account-eyebrow">Mi perfil</p>
      <div className="account-profile">
        <span className="account-avatar" aria-hidden="true">👤</span>
        <div>
          <h2 id="account-title">{user.name}</h2>
          <p>Carnet: {user.carnet}</p>
        </div>
      </div>

      <div className="purchase-heading">
        <div>
          <p className="account-eyebrow">Historial</p>
          <h3>Mis compras</h3>
        </div>
        <span>{purchases.length}</span>
      </div>

      {purchases.length === 0 ? (
        <div className="empty-purchases">
          <span aria-hidden="true">🛍️</span>
          <p>Aún no tienes compras registradas.</p>
          <small>Cuando confirmes un pedido aparecerá aquí.</small>
        </div>
      ) : (
        <div className="purchase-list">
          {purchases.map((purchase) => (
            <article className="purchase-card" key={purchase.id}>
              <div className="purchase-card-header">
                <div>
                  <h4>Pedido #{purchase.id.slice(0, 8)}</h4>
                  <p>{new Intl.DateTimeFormat("es-BO", { dateStyle: "medium" }).format(new Date(purchase.createdAt))}</p>
                </div>
                <strong>Bs. {purchase.total}</strong>
              </div>
              <ul>
                {purchase.items.map((item) => (
                  <li key={item.productId}>{item.quantity} × {item.name}</li>
                ))}
              </ul>
              <small>{paymentMethodLabels[purchase.paymentMethod] ?? purchase.paymentMethod}</small>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Account;
