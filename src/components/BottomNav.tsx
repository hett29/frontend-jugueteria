import "./BottomNav.css";

interface BottomNavProps {
  activeView: "home" | "cart" | "payment" | "account";
  onCartClick: () => void;
  onHomeClick: () => void;
  onPaymentClick: () => void;
  onAccountClick: () => void;
}

function BottomNav({
  activeView,
  onCartClick,
  onHomeClick,
  onPaymentClick,
  onAccountClick,
}: BottomNavProps) {
  return (
    <nav className="bottom-nav">

      <button
        type="button"
        className={activeView === "home" ? "active" : ""}
        onClick={onHomeClick}
      >
        🏠
        <span>Inicio</span>
      </button>

      <button
        type="button"
        className={activeView === "cart" ? "active" : ""}
        onClick={onCartClick}
      >
        🛒
        <span>Carrito</span>
      </button>

      <button
        type="button"
        className={activeView === "payment" ? "active" : ""}
        onClick={onPaymentClick}
      >
        🧾
        <span>Metodo de Pago</span>
      </button>

      <button
        type="button"
        className={activeView === "account" ? "active" : ""}
        onClick={onAccountClick}
      >
        👤
        <span>Cuenta</span>
      </button>

    </nav>
  );
}

export default BottomNav;
