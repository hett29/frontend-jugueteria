import "./HeroBanner.css";

function HeroBanner() {
  return (
    <section className="hero-banner">

      <div className="hero-content">
        <h1>
          ¡Diversión sin límites!
        </h1>

        <p>
          Los mejores juguetes
          <br />
          están aquí
        </p>

        <button>
          Comprar ahora
        </button>
      </div>

      <div className="hero-toy">
        🧸
      </div>

    </section>
  );
}

export default HeroBanner;