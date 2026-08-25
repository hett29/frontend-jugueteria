import type { Product } from "../data/products";
import "./Cart.css";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onIncrease: (product: Product) => void;
  onDecrease: (productId: number) => void;
  onContinueShopping: () => void;
  onProceedToPayment: () => void;
}

function Cart({
  items,
  onIncrease,
  onDecrease,
  onContinueShopping,
  onProceedToPayment,
}: CartProps) {
  const total = items.reduce(
    (sum, { product, quantity }) => sum + product.precio * quantity,
    0,
  );

  return (
    <section className="cart-section" aria-labelledby="cart-title">
      <div className="cart-header">
        <div>
          <p className="cart-eyebrow">Tu selección</p>
          <h2 id="cart-title">Carrito de compras</h2>
        </div>
        <button type="button" onClick={onContinueShopping}>
          Seguir comprando
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <span aria-hidden="true">🛒</span>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega tus juguetes favoritos para verlos aquí.</p>
          <button type="button" onClick={onContinueShopping}>
            Ver productos
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(({ product, quantity }) => (
              <article className="cart-item" key={product.id}>
                <img src={product.imagen} alt={product.nombre} />
                <div className="cart-item-details">
                  <h3>{product.nombre}</h3>
                  <p>Bs. {product.precio}</p>
                </div>
                <div className="quantity-controls" aria-label={`Cantidad de ${product.nombre}`}>
                  <button
                    type="button"
                    onClick={() => onDecrease(product.id)}
                    aria-label={`Quitar una unidad de ${product.nombre}`}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => onIncrease(product)}
                    aria-label={`Agregar una unidad de ${product.nombre}`}
                  >
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="cart-total">
            <span>Total</span>
            <strong>Bs. {total}</strong>
          </div>

          <button
            type="button"
            className="proceed-to-payment"
            onClick={onProceedToPayment}
          >
            Continuar al método de pago
          </button>
        </>
      )}
    </section>
  );
}

export default Cart;
