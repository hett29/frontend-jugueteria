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
  {
    id: "qr",
    icon: "▣",
    title: "Pago mediante QR",
    description: "Escanea el código QR para realizar tu pago.",
  },
  {
    id: "card",
    icon: "💳",
    title: "Pago con tarjeta",
    description: "Introduce el monto correspondiente al pedido.",
  },
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
        <span className="payment-success-icon" aria-hidden="true">
          ✓
        </span>
        <p className="payment-eyebrow">Pedido registrado</p>
        <h2>¡Gracias por tu compra!</h2>
        <p>
          Tu pedido se ha registrado correctamente. Puedes consultar su estado
          en la sección de mis compras.
        </p>
        <button
          type="button"
          className="confirm-payment"
          onClick={onViewPurchases}
        >
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

      <p className="payment-eyebrow">Último paso</p>
      <h2 id="payment-title">Método de pago</h2>
      <p className="payment-description">
        Selecciona tu método de pago preferido.
      </p>

      <div
        className="payment-options"
        role="radiogroup"
        aria-label="Métodos de pago"
      >
        {paymentMethods.map((method) => (
          <label className="payment-option" key={method.id}>
            <input
              type="radio"
              name="payment-method"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => setSelectedMethod(method.id)}
            />
            <span className="payment-icon" aria-hidden="true">
              {method.icon}
            </span>
            <span>
              <strong>{method.title}</strong>
              <small>{method.description}</small>
            </span>
          </label>
        ))}
      </div>

      {selectedMethod === "qr" && (
        <div className="payment-details qr-payment" aria-live="polite">
          <img
            src="/images/qr-pago.jpeg"
            alt="Código QR para realizar el pago"
          />

          <div>
            <h3>Pago mediante QR</h3>
            <p>
              Escanea el código QR con tu aplicación bancaria y verifica los
              datos antes de confirmar el pago.
            </p>
          </div>
        </div>
      )}

      {selectedMethod === "card" && (
        <form
          className="payment-details card-payment"
          onSubmit={(event) => event.preventDefault()}
        >
          <h3>Datos de pago</h3>
          <p>Introduce la información solicitada.</p>

          <label htmlFor="card-number">
            Número de tarjeta
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
            Clave (opcional)
            <input
              id="card-password"
              type="password"
              autoComplete="off"
              placeholder="No introduzcas tu clave bancaria real"
              value={cardPassword}
              onChange={(event) => setCardPassword(event.target.value)}
            />
          </label>
        </form>
      )}

      <div className="payment-total">
        <span>Total del pedido</span>
        <strong>Bs. {total}</strong>
      </div>

      {selectedMethod === "card" && (
        <div className="payment-amount">
          <label htmlFor="payment-amount">
            Monto del pedido
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
              aria-describedby={
                amountError ? "payment-amount-error" : undefined
              }
              aria-invalid={Boolean(amountError)}
            />
          </label>

          {amountError && (
            <p
              id="payment-amount-error"
              className="payment-amount-error"
              role="alert"
            >
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
        Confirmar pedido
      </button>
    </section>
  );
}

export default PaymentMethods;