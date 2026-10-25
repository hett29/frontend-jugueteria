
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { DistributorApplication } from "../../types/distributor";
import "./DistributorRequestPage.css";

const STORAGE_KEY = "app_distributor_applications";

const bolivianDepartments = [
  "Chuquisaca",
  "La Paz",
  "Cochabamba",
  "Oruro",
  "Potosí",
  "Tarija",
  "Santa Cruz",
  "Beni",
  "Pando",
];

function DistributorRequestPage() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [representative, setRepresentative] = useState("");
  const [carnet, setCarnet] = useState("");
  const [nit, setNit] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [businessActivity, setBusinessActivity] = useState("");
  const [experience, setExperience] = useState("");

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setError("");

    if (!file) {
      setCvFile(null);
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setCvFile(null);
      event.target.value = "";
      setError("La hoja de vida debe estar en formato PDF.");
      return;
    }

    if (file.size > 700 * 1024) {
      setCvFile(null);
      event.target.value = "";
      setError("El PDF no debe superar los 700 KB.");
      return;
    }

    setCvFile(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!cvFile) {
      setError("Debes adjuntar tu hoja de vida en formato PDF.");
      return;
    }

    const cleanCarnet = carnet.trim();

    let applications: DistributorApplication[];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      applications = stored ? JSON.parse(stored) : [];

      if (!Array.isArray(applications)) {
        applications = [];
      }
    } catch {
      setError("No se pudieron leer las solicitudes guardadas.");
      return;
    }

    const existingApplication = applications.find(
      (application) =>
        application.carnet.trim() === cleanCarnet &&
        application.status !== "RECHAZADA"
    );

    if (existingApplication) {
      setError(
        "Ya existe una solicitud pendiente o aprobada con este carnet."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("No se pudo leer el archivo PDF. Intenta nuevamente.");
        return;
      }

      const application: DistributorApplication = {
        id: `distributor-${Date.now()}`,
        businessName: businessName.trim(),
        representative: representative.trim(),
        carnet: cleanCarnet,
        nit: nit.trim(),
        phone: phone.trim(),
        email: email.trim(),
        department,
        city: city.trim(),
        address: address.trim(),
        businessActivity: businessActivity.trim(),
        experience: experience.trim(),
        cvName: cvFile.name,
        cvData: reader.result,
        status: "PENDIENTE",
        createdAt: new Date().toISOString(),
      };

      try {
        const currentStored = localStorage.getItem(STORAGE_KEY);
        const currentApplications: DistributorApplication[] =
          currentStored ? JSON.parse(currentStored) : [];

        const duplicate = currentApplications.some(
          (item) =>
            item.carnet.trim() === cleanCarnet &&
            item.status !== "RECHAZADA"
        );

        if (duplicate) {
          setError(
            "Ya existe una solicitud pendiente o aprobada con este carnet."
          );
          return;
        }

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([...currentApplications, application])
        );

        setSuccess(true);
      } catch {
        setError(
          "No se pudo guardar la solicitud. Comprueba el espacio disponible del navegador e inténtalo de nuevo."
        );
      }
    };

    reader.onerror = () => {
      setError("No se pudo leer el PDF. Intenta seleccionar el archivo otra vez.");
    };

    reader.readAsDataURL(cvFile);
  };

  return (
    <main className="distributor-request-page">
      <section className="distributor-request-card">
        <header>
          <h1>Solicitud de distribuidor</h1>
          <p>
            Completa tus datos comerciales y adjunta tu hoja de vida.
            El administrador revisará la solicitud antes de autorizar
            la creación de tu cuenta.
          </p>
        </header>

        {success ? (
          <div className="distributor-request-success" role="status">
            <h2>¡Solicitud enviada!</h2>
            <p>
              Tu solicitud quedó registrada como pendiente de revisión.
              Podrás crear tu cuenta cuando el administrador la apruebe.
            </p>
            <button type="button" onClick={() => navigate("/login")}>
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="businessName">Nombre del negocio *</label>
            <input
              id="businessName"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              required
              maxLength={120}
            />

            <label htmlFor="representative">Nombre del representante *</label>
            <input
              id="representative"
              value={representative}
              onChange={(event) => setRepresentative(event.target.value)}
              required
              maxLength={120}
            />

            <label htmlFor="carnet">Carnet de identidad *</label>
            <input
              id="carnet"
              value={carnet}
              onChange={(event) => setCarnet(event.target.value)}
              required
              maxLength={30}
            />

            <label htmlFor="nit">NIT (si corresponde)</label>
            <input
              id="nit"
              value={nit}
              onChange={(event) => setNit(event.target.value)}
              maxLength={40}
            />

            <label htmlFor="phone">Teléfono de contacto *</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              maxLength={30}
            />

            <label htmlFor="email">Correo electrónico *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={150}
            />

            <label htmlFor="department">Departamento *</label>
            <select
              id="department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              required
            >
              <option value="">Selecciona un departamento</option>
              {bolivianDepartments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="city">Ciudad *</label>
            <input
              id="city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
              maxLength={100}
            />

            <label htmlFor="address">Dirección del negocio *</label>
            <input
              id="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
              maxLength={200}
            />

            <label htmlFor="businessActivity">
              Actividad comercial del negocio *
            </label>
            <textarea
              id="businessActivity"
              value={businessActivity}
              onChange={(event) => setBusinessActivity(event.target.value)}
              required
              rows={3}
              maxLength={1000}
              placeholder="Ej.: venta de juguetes, tienda comercial..."
            />

            <label htmlFor="experience">Experiencia comercial</label>
            <textarea
              id="experience"
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Describe brevemente tu experiencia."
            />

            <label htmlFor="cvFile">Hoja de vida en PDF * (máximo 700 KB)</label>
            <input
              id="cvFile"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              required
            />

            {cvFile && <p>Archivo seleccionado: {cvFile.name}</p>}

            {error && (
              <p className="distributor-request-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit">Enviar solicitud</button>
          </form>
        )}

        <p className="distributor-request-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </section>
    </main>
  );
}

export default DistributorRequestPage;
