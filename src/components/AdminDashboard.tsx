import { useState } from "react";
import { authRepository } from "../repositories/authRepository";
import { purchaseRepository } from "../repositories/purchaseRepository";
import type { Purchase, PurchaseStatus } from "../types/purchase";
import "./AdminDashboard.css";

interface AdminDashboardProps { onLogout: () => void; }

const statusText: Record<PurchaseStatus, string> = {
  PENDIENTE: "Pendiente",
  ACEPTADO: "Aceptado",
  RECHAZADO: "Rechazado",
};

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [refresh, setRefresh] = useState(0);
  const orders = purchaseRepository.getAll();
  const users = authRepository.getAllUsers().filter((user) => user.role === "USUARIO");
  const [filter, setFilter] = useState<"TODOS" | PurchaseStatus>("TODOS");
  const filteredOrders = filter === "TODOS" ? orders : orders.filter((order) => order.status === filter);
  void refresh;

  const changeStatus = (id: string, status: PurchaseStatus) => {
    purchaseRepository.updateStatus(id, status);
    setRefresh((value) => value + 1);
  };

  const userFor = (order: Purchase) => users.find((user) => user.id === order.userId);

  return (
    <section className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div><p className="admin-eyebrow">Panel de control</p><h1>Administración · Mundo Mágico</h1><p>Gestiona pedidos y consulta la ubicación de entrega de tus clientes.</p></div>
        <button type="button" onClick={onLogout}>Cerrar sesión</button>
      </header>
      <div className="admin-stats">
        <article><span>Pedidos</span><strong>{orders.length}</strong></article>
        <article><span>Pendientes</span><strong>{orders.filter((o) => o.status === "PENDIENTE").length}</strong></article>
        <article><span>Aceptados</span><strong>{orders.filter((o) => o.status === "ACEPTADO").length}</strong></article>
        <article><span>Usuarios</span><strong>{users.length}</strong></article>
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>Pedidos recibidos</h2><p>Revisa los artículos, el cliente y la dirección indicada.</p></div>
          <label>Filtrar <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="TODOS">Todos</option><option value="PENDIENTE">Pendientes</option><option value="ACEPTADO">Aceptados</option><option value="RECHAZADO">Rechazados</option></select></label>
        </div>
        {filteredOrders.length === 0 ? <div className="admin-empty"><span>📦</span><h3>No hay pedidos en esta categoría</h3><p>Los nuevos pedidos aparecerán aquí.</p></div> : (
          <div className="admin-order-list">
            {filteredOrders.map((order) => {
              const user = userFor(order);
              return <article className="admin-order-card" key={order.id}>
                <div className="admin-order-top"><div><h3>Pedido #{order.id.slice(0, 8)}</h3><p>{new Intl.DateTimeFormat("es-BO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.createdAt))}</p></div><strong>Bs. {order.total}</strong></div>
                <div className="admin-customer"><strong>{user?.name ?? "Cliente"}</strong><span>Carnet: {user?.carnet ?? "No disponible"}</span><span>📍 {order.deliveryLocation.city}, {order.deliveryLocation.department}</span></div>
                <ul>{order.items.map((item) => <li key={item.productId}>{item.quantity} × {item.name} — Bs. {item.price * item.quantity}</li>)}</ul>
                <p className={`order-status order-status-${order.status.toLowerCase()}`}>Estado: {statusText[order.status]}</p>
                <div className="admin-order-actions">
                  <button type="button" onClick={() => changeStatus(order.id, "ACEPTADO")} disabled={order.status === "ACEPTADO"}>Aceptar pedido</button>
                  <button type="button" className="reject-order" onClick={() => changeStatus(order.id, "RECHAZADO")} disabled={order.status === "RECHAZADO"}>Rechazar pedido</button>
                  {order.status !== "PENDIENTE" && <button type="button" className="reset-order" onClick={() => changeStatus(order.id, "PENDIENTE")}>Volver a pendiente</button>}
                </div>
              </article>;
            })}
          </div>
        )}
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>Usuarios registrados (cuentas de demostración)</h2><p>Ubicación guardada en este navegador.</p></div></div>
        <div className="admin-user-list">{users.map((user) => <article key={user.id}><strong>{user.name}</strong><span>Carnet: {user.carnet}</span><span>📍 {user.city && user.department ? `${user.city}, ${user.department}` : "Ubicación aún no registrada"}</span></article>)}</div>
      </section>
      <p className="admin-demo-note">Modo demostración: los pedidos se guardan en el almacenamiento local de este navegador. Para que usuarios y administrador vean cambios desde dispositivos distintos, será necesario conectar la tienda a una API y base de datos compartida.</p>
    </section>
  );
}

export default AdminDashboard;
