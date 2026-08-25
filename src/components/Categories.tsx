import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import "./Categories.css";

function Categories() {
  return (
    <section className="categories-section">

      <div className="section-header">
        <h2>Categorías</h2>

        <Link to="/categorias/mas">Ver más</Link>
      </div>

      <div className="categories-list">

        {categories.map((category) => (
          <Link
            to={`/categorias/${category.id}`}
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
          </Link>
        ))}

      </div>

    </section>
  );
}

export default Categories;
