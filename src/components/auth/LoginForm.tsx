import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";
import "./LoginForm.css";

interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
}

function LoginForm({ error, onSubmit }: LoginFormProps) {
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const normalizedCarnet = carnet.trim();

    // Validar campos
    if (!normalizedCarnet || !password) {
      return;
    }

    // Enviar los datos al componente padre
    onSubmit({
      carnet: normalizedCarnet,
      password,
    });
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <p className="login-form-subtitle">
          Ingresa tus datos para continuar
        </p>

        {/* Carnet de identidad */}
        <div className="login-form-group">
          <label htmlFor="carnet">
            Carnet de identidad
          </label>

          <input
            id="carnet"
            name="carnet"
            type="text"
            value={carnet}
            onChange={(event) => setCarnet(event.target.value)}
            placeholder="Ingrese su carnet"
            autoComplete="username"
            required
          />
        </div>

        {/* Contraseña */}
        <div className="login-form-group">
          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingrese su contraseña"
            autoComplete="current-password"
            required
          />
        </div>

        {/* Mensaje de error */}
        {error && (
          <p
            className="login-form-error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* Botón */}
        <button type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default LoginForm;