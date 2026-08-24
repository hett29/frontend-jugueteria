import "./BottomNav.css";

interface BottomNavProps {
  isCartOpen: boolean;
  onCartClick: () => void;
  onHomeClick: () => void;
}

function BottomNav({
  isCartOpen,
  onCartClick,
  onHomeClick,
}: BottomNavProps) {
  return (
    <nav className="bottom-nav">

      <button
        type="button"
        className={isCartOpen ? "" : "active"}
        onClick={onHomeClick}
      >
        🏠
        <span>Inicio</span>
      </button>

      <button type="button">
        ▦
        <span>Categorías</span>
      </button>

      <button
        type="button"
        className={isCartOpen ? "active" : ""}
        onClick={onCartClick}
      >
        🛒
        <span>Carrito</span>
      </button>

      <button type="button">
        🧾
        <span>Pedidos</span>
      </button>

      <button type="button">
        👤
        <span>Cuenta</span>
      </button>

    </nav>
  );
}

export default BottomNav;
