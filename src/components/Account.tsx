import { useState } from "react";
import type { User } from "../types/auth";
import { bolivianDepartments } from "../types/auth";
import type { Purchase } from "../types/purchase";
import "./Account.css";

interface AccountProps {
  user: User | null;
  purchases: Purchase[];
  onUpdateLocation: (department: string, city: string) => void;
}

const paymentMethodLabels: Record<string, string> = {
  qr: "QR de demostración",
  card: "Tarjeta de prueba",
};
const statusLabels = {
  PENDIENTE: "Pendiente de revisión",
  ACEPTADO: "Pedido aceptado",
  RECHAZADO: "Pedido rechazado",
};

function Account({ user, purchases, onUpdateLocation }: AccountProps) {
  const [department, setDepartment] = useState(user?.department ?? "");
  const [city, setCity] = useState(user?.city ?? "");

  if (!user) {
    return <section className="account-section"><h2>Tu cuenta</h2><p>Inicia sesión para consultar tus compras.</p></section>;
  }

  return (
    <section className="account-section" aria-labelledby="account-title">
      <p className="account-eyebrow">Mi perfil</p>
      <div className="account-profile">
        <span className="account-avatar" aria-hidden="true">👤</span>
        <div><h2 id="account-title">{user.name}</h2><p>Carnet: {user.carnet}</p></div>
      </div>

      <form className="delivery-location-form" onSubmit={(event) => { event.preventDefault(); onUpdateLocation(department, city); }}>
        <h3>📍 Dirección para la entrega</h3>
        <p>Completa tu departamento y ciudad para que el administrador pueda organizar tu pedido.</p>
        <label htmlFor="delivery-department">Departamento</label>
        <select id="delivery-department" value={department} onChange={(event) => setDepartment(event.target.value)} required>
          <option value="">Selecciona tu departamento</option>
          {bolivianDepartments.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        <label htmlFor="delivery-city">Ciudad o municipio</label>
        <input id="delivery-city" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Ej. Sucre" required maxLength={80} />
        <button type="submit">Guardar ubicación</button>
      </form>

      <div className="purchase-heading">
        <div><p className="account-eyebrow">Historial y notificaciones</p><h3>Mis pedidos</h3></div>
        <span>{purchases.length}</span>
      </div>

      {purchases.length === 0 ? (
        <div className="empty-purchases"><span aria-hidden="true">🛍️</span><p>Aún no tienes pedidos registrados.</p><small>Cuando registres un pedido aparecerá aquí.</small></div>
      ) : (
        <div className="purchase-list">
          {purchases.map((purchase) => (
            <article className="purchase-card" key={purchase.id}>
              <div className="purchase-card-header">
                <div><h4>Pedido #{purchase.id.slice(0, 8)}</h4><p>{new Intl.DateTimeFormat("es-BO", { dateStyle: "medium" }).format(new Date(purchase.createdAt))}</p></div>
                <strong>Bs. {purchase.total}</strong>
              </div>
              <p className={`order-status order-status-${purchase.status.toLowerCase()}`}>{statusLabels[purchase.status]}</p>
              {purchase.status === "ACEPTADO" && <p className="order-notice">¡Buenas noticias! El administrador aceptó tu pedido.</p>}
              {purchase.status === "RECHAZADO" && <p className="order-notice">El administrador rechazó tu pedido. Contacta a la tienda si necesitas más información.</p>}
              {purchase.status === "PENDIENTE" && <p className="order-notice">Tu pedido está esperando la revisión del administrador.</p>}
              <ul>{purchase.items.map((item) => <li key={item.productId}>{item.quantity} × {item.name}</li>)}</ul>
              <small>{paymentMethodLabels[purchase.paymentMethod] ?? purchase.paymentMethod}</small>
              <p className="delivery-summary">Entrega: {purchase.deliveryLocation.city}, {purchase.deliveryLocation.department}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Account;
