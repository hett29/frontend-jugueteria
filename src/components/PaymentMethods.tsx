import { useState } from "react";

import type { CartItem } from "./Cart";
import "./PaymentMethods.css";

interface PaymentMethodsProps {
  items: CartItem[];
  onBackToCart: () => void;
}

const paymentMethods = [
  { id: "qr", icon: "▣", title: "Pago con QR", description: "Escanea el código al confirmar tu pedido." },
  { id: "card", icon: "💳", title: "Tarjeta", description: "Débito o crédito." },
  { id: "cash", icon: "💵", title: "Efectivo", description: "Paga al momento de recoger tu pedido." },
];

function PaymentMethods({ items, onBackToCart }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const total = items.reduce(
    (sum, { product, quantity }) => sum + product.precio * quantity,
    0,
  );

  return (
    <section className="payment-section" aria-labelledby="payment-title">
      <button type="button" className="back-to-cart" onClick={onBackToCart}>
        ← Volver al carrito
      </button>

      <p className="payment-eyebrow">Último paso</p>
      <h2 id="payment-title">Método de pago</h2>
      <p className="payment-description">Elige cómo deseas pagar tu pedido.</p>

      <div className="payment-options" role="radiogroup" aria-label="Métodos de pago">
        {paymentMethods.map((method) => (
          <label className="payment-option" key={method.id}>
            <input
              type="radio"
              name="payment-method"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => setSelectedMethod(method.id)}
            />
            <span className="payment-icon" aria-hidden="true">{method.icon}</span>
            <span>
              <strong>{method.title}</strong>
              <small>{method.description}</small>
            </span>
          </label>
        ))}
      </div>

      <div className="payment-total">
        <span>Total a pagar</span>
        <strong>Bs. {total}</strong>
      </div>
    </section>
  );
}

export default PaymentMethods;
