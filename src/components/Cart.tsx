
import type { Product } from "../data/products";
import "./Cart.css";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  isDistributor: boolean;
  onIncrease: (product: Product) => void;
  onDecrease: (productId: number) => void;
  onContinueShopping: () => void;
  onProceedToPayment: () => void;
}

function Cart({
  items,
  isDistributor,
  onIncrease,
  onDecrease,
  onContinueShopping,
  onProceedToPayment,
}: CartProps) {
  const total = items.reduce(
    (sum, { product, quantity }) =>
      sum + product.precio * quantity,
    0
  );

  return (
    <section className="cart-section">
      <div className="cart-header">
        <h2>Mi carrito</h2>
        <p>
          {items.reduce((sum, item) => sum + item.quantity, 0)} unidades
          en total
        </p>
      </div>

      {isDistributor && (
        <div className="wholesale-cart-notice">
          <h3>Pedido mayorista</h3>
          <p>
            Se aplica un descuento del 20 % sobre el precio minorista.
          </p>
          <p>
            La compra se realiza en paquetes de 12 unidades por producto.
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito está vacío.</p>
          <button type="button" onClick={onContinueShopping}>
            Volver al catálogo
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(({ product, quantity }) => (
              <article className="cart-item" key={product.id}>
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <h3>{product.nombre}</h3>

                  <p>
                    Precio unitario: Bs. {product.precio.toFixed(2)}
                  </p>

                  <p>
                    Subtotal: Bs. {(product.precio * quantity).toFixed(2)}
                  </p>

                  {isDistributor && (
                    <p className="wholesale-label">
                      Precio mayorista
                    </p>
                  )}

                  <div
                    className="cart-quantity-controls"
                    aria-label={`Cantidad de ${product.nombre}`}
                  >
                    <button
                      type="button"
                      onClick={() => onDecrease(product.id)}
                      aria-label={`Disminuir ${product.nombre}`}
                    >
                      −
                    </button>

                    <span aria-live="polite">{quantity}</span>

                    <button
                      type="button"
                      onClick={() => onIncrease(product)}
                      aria-label={`Aumentar ${product.nombre}`}
                    >
                      +
                    </button>
                  </div>

                  {isDistributor && (
                    <p className="wholesale-minimum">
                      Incrementos de 12 unidades
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: Bs. {total.toFixed(2)}</h3>

            <div className="cart-actions">
              <button
                type="button"
                onClick={onContinueShopping}
              >
                Seguir comprando
              </button>

              <button
                type="button"
                onClick={onProceedToPayment}
              >
                Continuar al pago
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
