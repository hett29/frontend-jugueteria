
import "./Navbar.css";

interface User {
  name?: string;
  carnet?: string;
  role?: string;
}

interface NavbarProps {
  cartCount: number;
  user?: User | null;
  onLogout?: () => void;
}

function Navbar({
  cartCount,
  user,
  onLogout,
}: NavbarProps) {
  return (
    <header className="navbar">

      {/* LOGO */}
      <div className="navbar-logo">

        <div className="logo-icon">
          🧸
        </div>

        <div className="logo-text">
          <strong>Mundo Mágico</strong>
          <small>Juguetería</small>
        </div>

      </div>

      {/* PARTE DERECHA */}
      <div className="navbar-user">

        {/* USUARIO */}
        {user && (
          <div className="user-welcome">

            <span className="user-icon">
              👤
            </span>

            <div>
              <span className="welcome-text">
                Bienvenido
              </span>

              <strong>
                {user.name || "Usuario"}
              </strong>
            </div>

          </div>
        )}

        {/* CARRITO */}
        <div className="navbar-cart">

          🛒

          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}

        </div>

        {/* CERRAR SESIÓN */}
        {user && onLogout && (
          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
          >
            Salir
          </button>
        )}

      </div>

    </header>
  );
}

export default Navbar;