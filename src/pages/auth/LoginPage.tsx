import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";
import type { LoginCredentials, UserRole } from "../../types/auth";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<UserRole, string>>({ ADMIN: "", USUARIO: "" });

  if (authRepository.isAuthenticated()) return <Navigate to="/" replace />;

  const handleLogin = (credentials: LoginCredentials, role: UserRole) => {
    setErrors({ ADMIN: "", USUARIO: "" });
    const user = authRepository.login(credentials, role);
    if (!user) {
      setErrors((current) => ({
        ...current,
        [role]: role === "ADMIN"
          ? "Las credenciales no corresponden a una cuenta administradora."
          : "El carnet o la contraseña de usuario son incorrectos.",
      }));
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <main className="login-page">
      <div className="login-page-content login-split-content">
        <header className="login-page-header">
          <div className="login-page-icon">🧸</div>
          <h1>Mundo Mágico</h1>
          <p>Selecciona el tipo de ingreso para continuar</p>
        </header>

        <div className="login-panels">
          <section className="login-page-card login-panel">
            <div className="login-panel-heading">
              <span className="login-panel-icon">👤</span>
              <h2>Ingreso de usuarios</h2>
              <p>Para comprar y consultar tus pedidos</p>
            </div>
            <LoginForm role="USUARIO" error={errors.USUARIO} onSubmit={handleLogin} />
          </section>

          <section className="login-page-card login-panel admin-login-panel">
            <div className="login-panel-heading">
              <span className="login-panel-icon">🛡️</span>
              <h2>Ingreso de administradores</h2>
              <p>Acceso exclusivo para gestionar la juguetería</p>
            </div>
            <LoginForm role="ADMIN" error={errors.ADMIN} onSubmit={handleLogin} />
          </section>
        </div>
        <footer className="login-page-footer">Cada ingreso valida el rol de la cuenta.</footer>
      </div>
    </main>
  );
}

export default LoginPage;
