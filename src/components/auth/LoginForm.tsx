import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials, UserRole } from "../../types/auth";
import "./LoginForm.css";

interface LoginFormProps {
  error?: string;
  role: UserRole;
  onSubmit: (credentials: LoginCredentials, role: UserRole) => void;
}

function LoginForm({ error, role, onSubmit }: LoginFormProps) {
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const normalizedCarnet = carnet.trim();
    if (!normalizedCarnet || !password) return;
    onSubmit({ carnet: normalizedCarnet, password }, role);
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor={`carnet-${role}`}>Carnet de identidad</label>
          <input
            id={`carnet-${role}`}
            name="carnet"
            type="text"
            value={carnet}
            onChange={(event) => setCarnet(event.target.value)}
            placeholder="Ingrese su carnet"
            autoComplete="username"
            required
          />
        </div>
        <div className="login-form-group">
          <label htmlFor={`password-${role}`}>Contraseña</label>
          <input
            id={`password-${role}`}
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingrese su contraseña"
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="login-form-error" role="alert" aria-live="polite">{error}</p>}
        <button type="submit">{role === "ADMIN" ? "Ingresar como administrador" : "Ingresar como usuario"}</button>
      </form>
    </div>
  );
}

export default LoginForm;
