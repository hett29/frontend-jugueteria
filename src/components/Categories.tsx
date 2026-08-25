import { categories } from "../data/categories";
import "./Categories.css";

function Categories() {
  return (
    <section className="categories-section">

      <div className="section-header">
        <h2>Categorías</h2>

        <a href="#catalogo">Ver todas</a>
      </div>

      <div className="categories-list">

        {categories.map((category) => (
          <a
            className="category"
            href={`#${category.id}`}
            key={category.id}
            aria-label={`Ver productos de ${category.nombre}`}
          >
            <div
              className={`category-icon ${category.color}`}
            >
              {category.icono}
            </div>

            <span>
              {category.nombre}
            </span>
          </a>
        ))}

      </div>

    </section>
  );
}

export default Categories;
