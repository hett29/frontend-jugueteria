import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";

import type { LoginCredentials } from "../../types/auth";

import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (authRepository.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (credentials: LoginCredentials) => {
    setError("");

    const user = authRepository.login(credentials);

    if (!user) {
      setError("El carnet o la contraseña son incorrectos.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="login-page">
      <div className="login-page-content">

        <div className="login-page-card">

          <header className="login-page-header">
            <div className="login-page-icon">
              🔐
            </div>

            <h1>Bienvenido</h1>

            <p>
              Inicia sesión para continuar
            </p>
          </header>

          <LoginForm
            error={error}
            onSubmit={handleLogin}
          />

          <footer className="login-page-footer">
            Sistema de acceso seguro
          </footer>

        </div>

      </div>
    </main>
  );
}

export default LoginPage;