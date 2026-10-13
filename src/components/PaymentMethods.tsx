import { useState } from "react";

import type { CartItem } from "./Cart";
import "./PaymentMethods.css";

interface PaymentMethodsProps {
  items: CartItem[];
  isPurchaseConfirmed: boolean;
  onBackToCart: () => void;
  onConfirm: (paymentMethod: string) => void;
  onViewPurchases: () => void;
}

const paymentMethods = [
  { id: "qr", icon: "▣", title: "QR de demostración", description: "Vista de prueba; no procesa pagos reales." },
  { id: "card", icon: "💳", title: "Tarjeta (prueba)", description: "Solo para probar el flujo de la tienda." },
];

function PaymentMethods({
  items,
  isPurchaseConfirmed,
  onBackToCart,
  onConfirm,
  onViewPurchases,
}: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);

  const [cardNumber, setCardNumber] = useState("");
  const [cardPassword, setCardPassword] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const total = items.reduce(
    (sum, { product, quantity }) => sum + product.precio * quantity,
    0,
  );

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
  };

  const handleConfirmPayment = () => {
    if (selectedMethod === "qr") {
      onConfirm(selectedMethod);
      return;
    }

    const amount = Number(enteredAmount.trim().replace(",", "."));

    if (!enteredAmount.trim() || !Number.isFinite(amount) || amount !== total) {
      setAmountError(`El monto ingresado debe ser exactamente Bs. ${total}.`);
      return;
    }

    setAmountError("");
    onConfirm(selectedMethod);
  };

  if (isPurchaseConfirmed) {
    return (
      <section className="payment-section payment-success" aria-live="polite">
        <span className="payment-success-icon" aria-hidden="true">✓</span>
        <p className="payment-eyebrow">Pedido de prueba registrado</p>
        <h2>¡Pedido registrado!</h2>
        <p>El pedido se guardó para probar la tienda. Este sitio todavía no verifica pagos reales; el QR es solo ilustrativo.</p>
        <button type="button" className="confirm-payment" onClick={onViewPurchases}>
          Ver mis compras
        </button>
      </section>
    );
  }

  return (
    <section className="payment-section" aria-labelledby="payment-title">
      <button type="button" className="back-to-cart" onClick={onBackToCart}>
        ← Volver al carrito
      </button>

      <p className="payment-eyebrow">Último paso · modo de prueba</p>
      <h2 id="payment-title">Método de pago</h2>
      <p className="payment-description">Elige una opción para probar el registro del pedido. No se realizará ningún cobro.</p>

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
          <img src="/images/qr-pago.svg" alt="Código QR gráfico de demostración, no válido para realizar pagos" />
          <div>
            <h3>QR de demostración</h3>
            <p>Este gráfico no está vinculado a una cuenta bancaria y no sirve para pagar. No envíes dinero usando este código.</p>
          </div>
        </div>
      )}

      {selectedMethod === "card" && (
        <form className="payment-details card-payment" onSubmit={(event) => event.preventDefault()}>
          <h3>Datos de prueba</h3>
          <p>Usa datos ficticios. No ingreses números de tarjeta ni contraseñas bancarias reales.</p>
          <label htmlFor="card-number">
            Número de tarjeta ficticio
            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(event) => handleCardNumberChange(event.target.value)}
              maxLength={19}
            />
          </label>
          <label htmlFor="card-password">
            Clave ficticia (opcional)
            <input
              id="card-password"
              type="password"
              autoComplete="off"
              placeholder="No uses tu clave real"
              value={cardPassword}
              onChange={(event) => setCardPassword(event.target.value)}
            />
          </label>
        </form>
      )}

      <div className="payment-total">
        <span>Total del pedido (sin cobro)</span>
        <strong>Bs. {total}</strong>
      </div>

      {selectedMethod === "card" && (
        <div className="payment-amount">
          <label htmlFor="payment-amount">
            Confirma el monto de prueba
            <input
              id="payment-amount"
              type="text"
              inputMode="decimal"
              placeholder={`Bs. ${total}`}
              value={enteredAmount}
              onChange={(event) => {
                setEnteredAmount(event.target.value);
                setAmountError("");
              }}
              aria-describedby={amountError ? "payment-amount-error" : undefined}
              aria-invalid={Boolean(amountError)}
            />
          </label>
          <p>Este dato solo comprueba el flujo de la tienda; no procesa un pago.</p>
          {amountError && (
            <p id="payment-amount-error" className="payment-amount-error" role="alert">
              {amountError}
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        className="confirm-payment"
        onClick={handleConfirmPayment}
        disabled={items.length === 0}
      >
        Registrar pedido de prueba
      </button>
    </section>
  );
}

export default PaymentMethods;
