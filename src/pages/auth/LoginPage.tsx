
import { useState } from "react";
import type { FormEventHandler } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";
import type { LoginCredentials, UserRole } from "../../types/auth";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState<Record<UserRole, string>>({
    ADMIN: "",
    USUARIO: "",
    DISTRIBUIDOR: "",
  });

  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState("");
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  if (authRepository.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (
    credentials: LoginCredentials,
    role: UserRole
  ) => {
    setErrors({
      ADMIN: "",
      USUARIO: "",
      DISTRIBUIDOR: "",
    });

    const user = authRepository.login(credentials, role);

    if (!user) {
      setErrors((current) => ({
        ...current,
        [role]:
          role === "ADMIN"
            ? "Las credenciales no corresponden a una cuenta administradora."
            : role === "DISTRIBUIDOR"
              ? "El carnet o la contraseña son incorrectos, o tu solicitud aún no está aprobada."
              : "El carnet o la contraseña de usuario son incorrectos.",
      }));
      return;
    }

    navigate("/", { replace: true });
  };

  const handleRegister: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setRegisterError("");

    const normalizedName = name.trim();
    const normalizedCarnet = carnet.trim();

    if (!normalizedName || !normalizedCarnet || !password) {
      setRegisterError("Completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setRegisterError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const newUser = authRepository.register({
      name: normalizedName,
      carnet: normalizedCarnet,
      password,
    });

    if (!newUser) {
      setRegisterError(
        "Ese carnet ya está registrado. Comprueba los datos."
      );
      return;
    }

    const loggedUser = authRepository.login(
      { carnet: normalizedCarnet, password },
      "USUARIO"
    );

    if (!loggedUser) {
      setRegisterError(
        "La cuenta se creó, pero no se pudo iniciar sesión. Intenta ingresar."
      );
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
          <p>Tu diversión comienza aquí</p>
        </header>

        <div className="login-panels">
          {/* PANEL DE USUARIOS */}
          <section className="login-page-card login-panel">
            <div className="login-panel-heading">
              <span className="login-panel-icon">👤</span>
              <h2>
                {showRegister
                  ? "Crear cuenta de usuario"
                  : "Ingreso de usuarios"}
              </h2>
              <p>
                {showRegister
                  ? "Regístrate para comenzar a comprar"
                  : "Ingresa o crea tu cuenta para comprar"}
              </p>
            </div>

            {showRegister ? (
              <div className="login-form-container">
                <form className="login-form" onSubmit={handleRegister}>
                  <div className="login-form-group">
                    <label htmlFor="register-name">Nombre completo</label>
                    <input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Escribe tu nombre"
                      autoComplete="name"
                      maxLength={80}
                      required
                    />
                  </div>

                  <div className="login-form-group">
                    <label htmlFor="register-carnet">
                      Carnet de identidad
                    </label>
                    <input
                      id="register-carnet"
                      type="text"
                      value={carnet}
                      onChange={(event) => setCarnet(event.target.value)}
                      placeholder="Escribe tu carnet"
                      autoComplete="username"
                      maxLength={20}
                      required
                    />
                  </div>

                  <div className="login-form-group">
                    <label htmlFor="register-password">Contraseña</label>
                    <input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Crea una contraseña"
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />
                  </div>

                  {registerError && (
                    <p
                      className="login-form-error"
                      role="alert"
                      aria-live="polite"
                    >
                      {registerError}
                    </p>
                  )}

                  <button type="submit">Crear cuenta</button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowRegister(false);
                      setRegisterError("");
                    }}
                  >
                    Volver al inicio de sesión
                  </button>
                </form>
              </div>
            ) : (
              <>
                <LoginForm
                  role="USUARIO"
                  error={errors.USUARIO}
                  onSubmit={handleLogin}
                />

                <div className="login-form-container">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegister(true);
                      setRegisterError("");
                    }}
                  >
                    ¿No tienes cuenta? Regístrate aquí
                  </button>
                </div>
              </>
            )}
          </section>

          {/* PANEL DE ADMINISTRADORES */}
          <section className="login-page-card login-panel admin-login-panel">
            <div className="login-panel-heading">
              <span className="login-panel-icon">🛡️</span>
              <h2>Ingreso de administradores</h2>
              <p>Acceso exclusivo para gestionar la juguetería</p>
            </div>

            <LoginForm
              role="ADMIN"
              error={errors.ADMIN}
              onSubmit={handleLogin}
            />
          </section>

          {/* PANEL DE DISTRIBUIDORES */}
          <section className="login-page-card login-panel distributor-login-panel">
            <div className="login-panel-heading">
              <span className="login-panel-icon">🏪</span>
              <h2>Ingreso de distribuidores</h2>
              <p>
                Acceso para negocios autorizados a comprar al por mayor
              </p>
            </div>

            <LoginForm
              role="DISTRIBUIDOR"
              error={errors.DISTRIBUIDOR}
              onSubmit={handleLogin}
            />

            <div className="login-form-container">
              <button
                type="button"
                onClick={() => navigate("/solicitud-distribuidor")}
              >
                Solicitar cuenta de distribuidor
              </button>

            </div>
          </section>
        </div>

        <footer className="login-page-footer">
          Mundo Mágico · Tu tienda de juguetes
        </footer>
      </div>
    </main>
  );
}

export default LoginPage;
