import "./BottomNav.css";

function BottomNav() {
  return (
    <nav className="bottom-nav">

      <button className="active">
        🏠
        <span>Inicio</span>
      </button>

      <button>
        ▦
        <span>Categorías</span>
      </button>

      <button>
        🛒
        <span>Carrito</span>
      </button>

      <button>
        🧾
        <span>Pedidos</span>
      </button>

      <button>
        👤
        <span>Cuenta</span>
      </button>

    </nav>
  );
}

export default BottomNav;