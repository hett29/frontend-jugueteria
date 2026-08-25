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
  const [cardNumber, setCardNumber] = useState("");
  const [cardPassword, setCardPassword] = useState("");
  const total = items.reduce(
    (sum, { product, quantity }) => sum + product.precio * quantity,
    0,
  );

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
  };

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

      {selectedMethod === "qr" && (
        <div className="payment-details qr-payment" aria-live="polite">
          <img src="/images/qr-pago.svg" alt="Vista previa del código QR de pago" />
          <div>
            <h3>Código QR de pago</h3>
            <p>Inserta aquí el código QR de tu cuenta para que tus clientes puedan realizar el pago.</p>
          </div>
        </div>
      )}

      {selectedMethod === "card" && (
        <form className="payment-details card-payment">
          <h3>Datos de la tarjeta</h3>
          <label htmlFor="card-number">
            Número de tarjeta
            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(event) => handleCardNumberChange(event.target.value)}
              maxLength={19}
            />
          </label>
          <label htmlFor="card-password">
            Contraseña de pago
            <input
              id="card-password"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              value={cardPassword}
              onChange={(event) => setCardPassword(event.target.value)}
            />
          </label>
        </form>
      )}

      <div className="payment-total">
        <span>Total a pagar</span>
        <strong>Bs. {total}</strong>
      </div>
    </section>
  );
}

export default PaymentMethods;
