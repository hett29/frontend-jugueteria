import "./Categories.css";

const categories = [
  {
    nombre: "Muñecas",
    icono: "👧",
    color: "pink",
  },
  {
    nombre: "Vehículos",
    icono: "🚗",
    color: "green",
  },
  {
    nombre: "Construcción",
    icono: "🧩",
    color: "yellow",
  },
  {
    nombre: "Juegos",
    icono: "🎮",
    color: "orange",
  },
  {
    nombre: "Más",
    icono: "•••",
    color: "blue",
  },
];

function Categories() {
  return (
    <section className="categories-section">

      <div className="section-header">
        <h2>Categorías</h2>

        <button>Ver todas</button>
      </div>

      <div className="categories-list">

        {categories.map((category) => (
          <div
            className="category"
            key={category.nombre}
          >
            <div
              className={`category-icon ${category.color}`}
            >
              {category.icono}
            </div>

            <span>
              {category.nombre}
            </span>
          </div>
        ))}

      </div>

    </section>
  );
}

export default Categories;