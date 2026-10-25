
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authRepository } from "../../repositories/authRepository";
import { distributorRepository } from "../../repositories/distributorRepository";
import "./DistributorRegisterPage.css";

function DistributorRegisterPage() {
  const navigate = useNavigate();
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const approvedApplications = distributorRepository
    .getAll()
    .filter((application) => application.status === "APROBADA");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanCarnet = carnet.trim();

    const approvedApplication = approvedApplications.find(
      (application) => application.carnet.trim() === cleanCarnet
    );

    if (!approvedApplication) {
      setError(
        "No encontramos una solicitud aprobada con ese carnet. Primero debes enviar tu solicitud y esperar la aprobación del administrador."
      );
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const user = authRepository.registerDistributor({
      carnet: cleanCarnet,
      password,
    });

    if (!user) {
      setError(
        "No se pudo crear la cuenta. Comprueba si el carnet ya está registrado."
      );
      return;
    }

    setSuccess("¡Cuenta creada correctamente! Ya puedes iniciar sesión.");

    window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1200);
  };

  return (
    <main className="distributor-register-page">
      <section className="distributor-register-card">
        <div className="distributor-register-heading">
          <span className="distributor-register-icon">🧸</span>
          <p className="distributor-register-eyebrow">Mundo Mágico</p>
          <h1>Crear cuenta de distribuidor</h1>
          <p>
            Registra tu carnet y crea una contraseña después de que tu
            solicitud comercial haya sido aprobada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="distributor-register-form">
          <label htmlFor="distributor-carnet">Carnet de identidad</label>
          <input
            id="distributor-carnet"
            type="text"
            value={carnet}
            onChange={(event) => setCarnet(event.target.value)}
            placeholder="Ingresa tu carnet"
            autoComplete="username"
            required
          />

          <label htmlFor="distributor-password">Crear contraseña</label>
          <input
            id="distributor-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            minLength={6}
            required
          />

          <label htmlFor="distributor-confirm-password">
            Confirmar contraseña
          </label>
          <input
            id="distributor-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            minLength={6}
            required
          />

          {error && (
            <p className="distributor-register-message error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="distributor-register-message success" role="status">
              {success}
            </p>
          )}

          <button type="submit">Crear mi cuenta</button>
        </form>

        <p className="distributor-register-footer">
          ¿Todavía no enviaste tu solicitud?{" "}
          <Link to="/solicitud-distribuidor">Solicitar aprobación</Link>
        </p>

        <p className="distributor-register-footer">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}

export default DistributorRegisterPage;
