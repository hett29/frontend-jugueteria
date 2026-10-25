
import { useState } from "react";
import { authRepository } from "../repositories/authRepository";
import { purchaseRepository } from "../repositories/purchaseRepository";
import { distributorRepository } from "../repositories/distributorRepository";
import type { DistributorApplication } from "../types/distributor";
import type { Purchase, PurchaseStatus } from "../types/purchase";
import "./AdminDashboard.css";

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminView =
  | "pedidos"
  | "pedidosDistribuidores"
  | "solicitudes"
  | "usuarios"
  | "distribuidores";

const statusText: Record<PurchaseStatus, string> = {
  PENDIENTE: "Pendiente",
  ACEPTADO: "Aceptado",
  RECHAZADO: "Rechazado",
};

const viewInfo: Record<AdminView, { title: string; description: string }> = {
  pedidos: {
    title: "Pedidos de usuarios",
    description: "Consulta y administra los pedidos de la tienda.",
  },
  pedidosDistribuidores: {
    title: "Pedidos de distribuidores",
    description: "Consulta y administra los pedidos mayoristas.",
  },
  solicitudes: {
    title: "Solicitudes de distribuidores",
    description: "Revisa las solicitudes comerciales y sus hojas de vida.",
  },
  usuarios: {
    title: "Usuarios registrados",
    description: "Busca y consulta las cuentas de tus clientes.",
  },
  distribuidores: {
    title: "Distribuidores registrados",
    description: "Consulta las cuentas mayoristas que has creado.",
  },
};

function generateTemporaryPassword() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let password = "MM-";
  for (let i = 0; i < 8; i++) {
    password += characters[Math.floor(Math.random() * characters.length)];
  }
  return password;
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<AdminView>("pedidos");
  const [refresh, setRefresh] = useState(0);
  const [orderFilter, setOrderFilter] = useState<"TODOS" | PurchaseStatus>("TODOS");
  const [userSearch, setUserSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("TODOS");
  const [applicationSearch, setApplicationSearch] = useState("");
  const [accountApplicationId, setAccountApplicationId] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [credentials, setCredentials] = useState<{
    name: string;
    carnet: string;
    password: string;
    phone: string;
    email: string;
  } | null>(null);

  // Volver a leer los datos guardados después de cada operación.
  void refresh;
  const allUsers = authRepository.getAllUsers();
  const users = allUsers.filter((user) => user.role === "USUARIO");
  const distributors = allUsers.filter((user) => user.role === "DISTRIBUIDOR");
  const orders = purchaseRepository.getAll();
  const applications = distributorRepository.getAll();

  const pendingUserOrders = orders.filter(
    (order) =>
      order.status === "PENDIENTE" &&
      users.some((user) => user.id === order.userId)
  ).length;

  const pendingDistributorOrders = orders.filter(
    (order) =>
      order.status === "PENDIENTE" &&
      distributors.some((user) => user.id === order.userId)
  ).length;

  const pendingOrders = pendingUserOrders + pendingDistributorOrders;

  const pendingApplications = applications.filter(
    (application) => application.status === "PENDIENTE"
  ).length;

  const filteredOrders = orders.filter((order) => {
    const belongsToDistributor = distributors.some(
      (user) => user.id === order.userId
    );
    const belongsToRegularUser = users.some(
      (user) => user.id === order.userId
    );
    const matchesView =
      activeView === "pedidosDistribuidores"
        ? belongsToDistributor
        : belongsToRegularUser;
    const matchesStatus =
      orderFilter === "TODOS" || order.status === orderFilter;

    return matchesView && matchesStatus;
  });

  const departments = Array.from(
    new Set(
      users
        .map((user) => user.department)
        .filter((department): department is string => Boolean(department))
    )
  ).sort((a, b) => a.localeCompare(b, "es"));

  const normalize = (value: string) => value.trim().toLocaleLowerCase("es");

  const filteredUsers = users.filter((user) => {
    const query = normalize(userSearch);
    const matchesSearch =
      !query ||
      normalize(user.name).includes(query) ||
      normalize(user.carnet).includes(query);

    const matchesDepartment =
      departmentFilter === "TODOS" || user.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const filteredDistributors = distributors.filter((user) => {
    const query = normalize(userSearch);
    return (
      !query ||
      normalize(user.name).includes(query) ||
      normalize(user.carnet).includes(query)
    );
  });

  const filteredApplications = applications
    .filter((application) => {
      const query = normalize(applicationSearch);
      return (
        !query ||
        normalize(application.businessName).includes(query) ||
        normalize(application.representative).includes(query) ||
        normalize(application.carnet).includes(query)
      );
    })
    .slice()
    .sort((a, b) => {
      if (a.status === "PENDIENTE" && b.status !== "PENDIENTE") return -1;
      if (a.status !== "PENDIENTE" && b.status === "PENDIENTE") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const refreshData = () => setRefresh((value) => value + 1);

  const changeOrderStatus = (id: string, status: PurchaseStatus) => {
    purchaseRepository.updateStatus(id, status);
    refreshData();
  };

  const changeApplicationStatus = (
    id: string,
    status: DistributorApplication["status"]
  ) => {
    const updated = distributorRepository.updateStatus(id, status);
    if (updated) {
      setAdminMessage(
        status === "APROBADA"
          ? "Solicitud aprobada. Ya puedes crear la cuenta del distribuidor."
          : status === "RECHAZADA"
            ? "La solicitud ha sido rechazada."
            : "La solicitud volvió a estar pendiente."
      );
      setAccountApplicationId("");
      setTemporaryPassword("");
      refreshData();
    }
  };

  const userFor = (order: Purchase) =>
    allUsers.find((user) => user.id === order.userId);

  const hasDistributorAccount = (carnet: string) =>
    distributors.some(
      (user) => normalize(user.carnet) === normalize(carnet)
    );

  const startAccountCreation = (application: DistributorApplication) => {
    setAdminMessage("");
    setCredentials(null);
    setAccountApplicationId(application.id);
    setTemporaryPassword(generateTemporaryPassword());
  };

  const createDistributorAccount = () => {
    const application = applications.find(
      (item) => item.id === accountApplicationId
    );

    if (!application || application.status !== "APROBADA") {
      setAdminMessage("Primero debes aprobar la solicitud.");
      return;
    }

    if (hasDistributorAccount(application.carnet)) {
      setAdminMessage("Ya existe una cuenta de distribuidor con ese carnet.");
      return;
    }

    if (temporaryPassword.trim().length < 6) {
      setAdminMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const created = authRepository.registerDistributor({
      carnet: application.carnet,
      password: temporaryPassword.trim(),
    });

    if (!created) {
      setAdminMessage(
        "No se pudo crear la cuenta. Comprueba que el carnet no esté registrado en otra cuenta."
      );
      return;
    }

    setCredentials({
      name: application.representative,
      carnet: application.carnet,
      password: temporaryPassword.trim(),
      phone: application.phone,
      email: application.email,
    });
    setAccountApplicationId("");
    setTemporaryPassword("");
    setAdminMessage("¡Cuenta creada correctamente! Guarda las credenciales antes de cerrar esta ventana.");
    refreshData();
  };

  const copyCredentials = async () => {
    if (!credentials) return;

    const text = [
      "Mundo Mágico · Cuenta de distribuidor",
      `Nombre: ${credentials.name}`,
      `Carnet: ${credentials.carnet}`,
      `Contraseña temporal: ${credentials.password}`,
      "Puedes iniciar sesión en la página de Mundo Mágico.",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setAdminMessage("Credenciales copiadas. Ya puedes pegarlas en WhatsApp o en un correo.");
    } catch {
      setAdminMessage("No se pudo copiar automáticamente. Selecciona y copia las credenciales mostradas.");
    }
  };

  const navItems: { id: AdminView; icon: string; label: string; count?: number }[] = [
    { id: "pedidos", icon: "📦", label: "Pedidos de usuarios", count: pendingUserOrders },
    { id: "pedidosDistribuidores", icon: "🏪", label: "Pedidos de distribuidores", count: pendingDistributorOrders },
    { id: "solicitudes", icon: "📋", label: "Solicitudes", count: pendingApplications },
    { id: "usuarios", icon: "👥", label: "Usuarios registrados" },
    { id: "distribuidores", icon: "🏬", label: "Distribuidores registrados" },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-icon">🧸</span>
          <div>
            <strong>Mundo Mágico</strong>
            <span>Panel administrativo</span>
          </div>
        </div>

        <p className="admin-menu-label">MENÚ PRINCIPAL</p>

        <nav className="admin-navigation" aria-label="Secciones administrativas">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveView(item.id);
                setAdminMessage("");
                setCredentials(null);
                setAccountApplicationId("");
              }}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span className="admin-nav-label">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="admin-nav-count">{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <span>Administración segura</span>
          <button type="button" onClick={onLogout}>
            <span>↪</span> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">MUNDO MÁGICO / ADMINISTRACIÓN</p>
            <h1>{viewInfo[activeView].title}</h1>
            <p>{viewInfo[activeView].description}</p>
          </div>
          <div className="admin-avatar" aria-label="Administrador">A</div>
        </header>

        <section className="admin-overview">
          <article className="admin-stat-card stat-purple">
            <span className="admin-stat-icon">📦</span>
            <div><span>Todos los pedidos</span><strong>{orders.length}</strong></div>
          </article>
          <article className="admin-stat-card stat-orange">
            <span className="admin-stat-icon">⏳</span>
            <div><span>Pedidos pendientes</span><strong>{pendingOrders}</strong></div>
          </article>
          <article className="admin-stat-card stat-pink">
            <span className="admin-stat-icon">📋</span>
            <div><span>Solicitudes pendientes</span><strong>{pendingApplications}</strong></div>
          </article>
          <article className="admin-stat-card stat-blue">
            <span className="admin-stat-icon">👥</span>
            <div><span>Clientes registrados</span><strong>{users.length}</strong></div>
          </article>
        </section>

        {adminMessage && (
          <div className="admin-feedback" role="status">
            <span>ℹ️</span>
            <p>{adminMessage}</p>
            <button type="button" onClick={() => setAdminMessage("")} aria-label="Cerrar mensaje">×</button>
          </div>
        )}

        {(activeView === "pedidos" || activeView === "pedidosDistribuidores") && (
          <section className="admin-content-panel">
            <div className="admin-section-heading">
              <div><h2>{activeView === "pedidosDistribuidores" ? "Pedidos de distribuidores" : "Pedidos de usuarios"}</h2><p>Consulta los productos, el cliente y el lugar de entrega.</p></div>
              <label className="admin-select-label">
                Estado
                <select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value as typeof orderFilter)}>
                  <option value="TODOS">Todos</option>
                  <option value="PENDIENTE">Pendientes</option>
                  <option value="ACEPTADO">Aceptados</option>
                  <option value="RECHAZADO">Rechazados</option>
                </select>
              </label>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="admin-empty"><span>📦</span><h3>No hay pedidos en esta categoría</h3><p>Los nuevos pedidos aparecerán aquí.</p></div>
            ) : (
              <div className="admin-card-list">
                {filteredOrders.map((order) => {
                  const user = userFor(order);
                  return (
                    <article className="admin-record-card" key={order.id}>
                      <div className="admin-record-heading">
                        <div><span className="admin-record-kicker">PEDIDO</span><h3>#{order.id.slice(0, 8)}</h3><p>{new Intl.DateTimeFormat("es-BO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.createdAt))}</p></div>
                        <div className="admin-record-total">Bs. {order.total}</div>
                      </div>
                      <div className="admin-detail-grid">
                        <div><span>Cliente</span><strong>{user?.name ?? "Cliente"}</strong></div>
                        <div><span>Carnet</span><strong>{user?.carnet ?? "No disponible"}</strong></div>
                        <div><span>Entrega</span><strong>{order.deliveryLocation.city}, {order.deliveryLocation.department}</strong></div>
                      </div>
                      <div className="admin-product-lines">
                        {order.items.map((item) => <div key={item.productId}><span>{item.quantity} × {item.name}</span><strong>Bs. {item.price * item.quantity}</strong></div>)}
                      </div>
                      <p className={`admin-status status-${order.status.toLowerCase()}`}>● {statusText[order.status]}</p>
                      <div className="admin-actions">
                        <button type="button" onClick={() => changeOrderStatus(order.id, "ACEPTADO")} disabled={order.status === "ACEPTADO"}>✓ Aceptar pedido</button>
                        <button type="button" className="admin-button-danger" onClick={() => changeOrderStatus(order.id, "RECHAZADO")} disabled={order.status === "RECHAZADO"}>Rechazar</button>
                        {order.status !== "PENDIENTE" && <button type="button" className="admin-button-light" onClick={() => changeOrderStatus(order.id, "PENDIENTE")}>Volver a pendiente</button>}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeView === "solicitudes" && (
          <section className="admin-content-panel">
            <div className="admin-section-heading">
              <div><h2>Solicitudes comerciales</h2><p>Revisa cada perfil antes de tomar una decisión.</p></div>
              <label className="admin-search"><span>Buscar solicitud</span><input value={applicationSearch} onChange={(event) => setApplicationSearch(event.target.value)} placeholder="Empresa, representante o carnet..." /></label>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="admin-empty"><span>📋</span><h3>No se encontraron solicitudes</h3><p>Las solicitudes recibidas aparecerán en esta sección.</p></div>
            ) : (
              <div className="admin-card-list">
                {filteredApplications.map((application) => {
                  const accountExists = hasDistributorAccount(application.carnet);
                  return (
                    <article className="admin-record-card application-card" key={application.id}>
                      <div className="admin-record-heading">
                        <div><span className="admin-record-kicker">SOLICITUD COMERCIAL</span><h3>{application.businessName}</h3><p>Enviada el {new Intl.DateTimeFormat("es-BO", { dateStyle: "medium" }).format(new Date(application.createdAt))}</p></div>
                        <span className={`admin-status-pill application-${application.status.toLowerCase()}`}>{application.status === "APROBADA" ? "Aprobada" : application.status === "RECHAZADA" ? "Rechazada" : "Pendiente"}</span>
                      </div>

                      <div className="admin-application-section">
                        <h4>👤 Datos del representante</h4>
                        <div className="admin-detail-grid">
                          <div><span>Nombre completo</span><strong>{application.representative}</strong></div>
                          <div><span>Carnet de identidad</span><strong>{application.carnet}</strong></div>
                          <div><span>Teléfono / WhatsApp</span><strong>{application.phone}</strong></div>
                          <div><span>Correo electrónico</span><strong>{application.email}</strong></div>
                        </div>
                      </div>

                      <div className="admin-application-section">
                        <h4>🏪 Datos del negocio</h4>
                        <div className="admin-detail-grid">
                          <div><span>NIT</span><strong>{application.nit || "No indicado"}</strong></div>
                          <div><span>Ubicación</span><strong>{application.city}, {application.department}</strong></div>
                          <div><span>Dirección</span><strong>{application.address}</strong></div>
                          <div><span>Actividad comercial</span><strong>{application.businessActivity}</strong></div>
                          <div className="detail-full"><span>Experiencia</span><strong>{application.experience || "No indicada"}</strong></div>
                        </div>
                      </div>

                      {application.cvData && (
                        <a className="admin-cv-link" href={application.cvData} target="_blank" rel="noreferrer">
                          <span>📄</span><span><strong>Ver hoja de vida</strong><small>{application.cvName}</small></span><span>↗</span>
                        </a>
                      )}

                      {application.status === "PENDIENTE" && (
                        <div className="admin-actions">
                          <button type="button" onClick={() => changeApplicationStatus(application.id, "APROBADA")}>✓ Aprobar solicitud</button>
                          <button type="button" className="admin-button-danger" onClick={() => changeApplicationStatus(application.id, "RECHAZADA")}>Rechazar solicitud</button>
                        </div>
                      )}

                      {application.status === "APROBADA" && (
                        <div className="admin-approved-box">
                          <div><strong>✓ Solicitud aprobada</strong><p>{accountExists ? "Ya se creó una cuenta para este carnet." : "Ya puedes crear la cuenta de acceso de este distribuidor."}</p></div>
                          {!accountExists && <button type="button" onClick={() => startAccountCreation(application)}>Crear cuenta</button>}
                        </div>
                      )}

                      {application.status !== "PENDIENTE" && (
                        <button type="button" className="admin-button-light" onClick={() => changeApplicationStatus(application.id, "PENDIENTE")}>Volver a pendiente</button>
                      )}

                      {accountApplicationId === application.id && (
                        <div className="admin-create-account">
                          <h4>Crear acceso para el distribuidor</h4>
                          <p>El carnet de la solicitud se usará como usuario. Genera una contraseña temporal y compártela de forma privada.</p>
                          <label>Carnet de identidad<input value={application.carnet} readOnly /></label>
                          <label>Contraseña temporal<input value={temporaryPassword} onChange={(event) => setTemporaryPassword(event.target.value)} minLength={6} /></label>
                          <div className="admin-actions">
                            <button type="button" className="admin-button-light" onClick={() => setTemporaryPassword(generateTemporaryPassword())}>Generar otra</button>
                            <button type="button" onClick={createDistributorAccount}>Confirmar y crear cuenta</button>
                            <button type="button" className="admin-button-light" onClick={() => setAccountApplicationId("")}>Cancelar</button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeView === "usuarios" && (
          <section className="admin-content-panel">
            <div className="admin-section-heading"><div><h2>Directorio de clientes</h2><p>Busca una cuenta sin tener que mostrar toda la lista.</p></div></div>
            <div className="admin-filter-row">
              <label className="admin-search"><span>Buscar por nombre o carnet</span><input type="search" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Escribe un nombre o carnet..." /></label>
              <label className="admin-select-label">Departamento<select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}><option value="TODOS">Todos</option>{departments.map((department) => <option key={department} value={department}>{department}</option>)}</select></label>
              <button type="button" className="admin-button-light" onClick={() => { setUserSearch(""); setDepartmentFilter("TODOS"); }}>Limpiar</button>
            </div>
            <p className="admin-results-count">Mostrando {filteredUsers.length} de {users.length} clientes</p>
            {filteredUsers.length === 0 ? <div className="admin-empty"><span>🔎</span><h3>No se encontraron clientes</h3><p>Prueba con otro nombre, carnet o departamento.</p></div> : (
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Cliente</th><th>Carnet</th><th>Ciudad</th><th>Departamento</th></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user.id}><td><strong>{user.name}</strong></td><td>{user.carnet}</td><td>{user.city || "Sin registrar"}</td><td>{user.department || "Sin registrar"}</td></tr>)}</tbody></table></div>
            )}
          </section>
        )}

        {activeView === "distribuidores" && (
          <section className="admin-content-panel">
            <div className="admin-section-heading"><div><h2>Directorio de distribuidores</h2><p>Cuentas creadas después de aprobar sus solicitudes.</p></div></div>
            <div className="admin-filter-row">
              <label className="admin-search"><span>Buscar distribuidor</span><input type="search" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Nombre o carnet..." /></label>
              <button type="button" className="admin-button-light" onClick={() => setUserSearch("")}>Limpiar búsqueda</button>
            </div>
            <p className="admin-results-count">Mostrando {filteredDistributors.length} de {distributors.length} distribuidores</p>
            {filteredDistributors.length === 0 ? <div className="admin-empty"><span>🏪</span><h3>Aún no hay distribuidores registrados</h3><p>Aprueba una solicitud y crea la cuenta desde la sección de solicitudes.</p></div> : (
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Distribuidor</th><th>Carnet</th><th>Acceso</th></tr></thead><tbody>{filteredDistributors.map((distributor) => <tr key={distributor.id}><td><strong>{distributor.name}</strong></td><td>{distributor.carnet}</td><td><span className="admin-status-pill application-aprobada">Cuenta creada</span></td></tr>)}</tbody></table></div>
            )}
          </section>
        )}

        {credentials && (
          <section className="admin-credentials-card">
            <div className="admin-credentials-heading"><span>🎉</span><div><h2>Cuenta creada correctamente</h2><p>Guarda estos datos y compártelos con el distribuidor por un canal privado.</p></div></div>
            <div className="admin-credentials-grid">
              <div><span>Nombre</span><strong>{credentials.name}</strong></div>
              <div><span>Carnet / usuario</span><strong>{credentials.carnet}</strong></div>
              <div><span>Contraseña temporal</span><strong className="credential-password">{credentials.password}</strong></div>
              <div><span>Celular</span><strong>{credentials.phone || "No indicado"}</strong></div>
              <div className="credential-email"><span>Correo electrónico</span><strong>{credentials.email || "No indicado"}</strong></div>
            </div>
            <div className="admin-actions"><button type="button" onClick={copyCredentials}>Copiar credenciales</button><button type="button" className="admin-button-light" onClick={() => setCredentials(null)}>Cerrar</button></div>
            <p className="admin-credential-note">El sistema no envía mensajes automáticamente. Debes compartir los datos por WhatsApp o correo. Recomienda cambiar la contraseña después del primer acceso si añades esa función.</p>
          </section>
        )}

        <footer className="admin-footer-note">Modo demostración: los datos se guardan en este navegador y no se sincronizan automáticamente con otros dispositivos.</footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
