import { Link, Navigate, useParams } from "react-router-dom";

import { categories, belongsToCategory } from "../data/categories";
import { products } from "../data/products";

import "./CategoryPage.css";

function CategoryPage() {
  const { categoryId } = useParams();
  const selectedCategory = categories.find((category) => category.id === categoryId);

  if (!selectedCategory) {
    return <Navigate to="/" replace />;
  }

  const categoryProducts = products.filter((product) =>
    belongsToCategory(product.categoria, selectedCategory.id),
  );

  return (
    <main className="category-page">
      <header className="category-page-header">
        <Link to="/" className="back-link">← Inicio</Link>
        <p>Explora por categoría</p>
        <h1>{selectedCategory.icono} {selectedCategory.nombre}</h1>
      </header>

      <nav className="category-tabs" aria-label="Categorías de productos">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categorias/${category.id}`}
            className={category.id === selectedCategory.id ? "selected" : ""}
            aria-current={category.id === selectedCategory.id ? "page" : undefined}
          >
            {category.nombre}
          </Link>
        ))}
      </nav>

      <section aria-labelledby="category-products-title">
        <h2 id="category-products-title">
          {categoryProducts.length} {categoryProducts.length === 1 ? "producto" : "productos"}
        </h2>
        <div className="category-products-grid">
          {categoryProducts.map((product) => (
            <article className="category-product-card" key={product.id}>
              <img src={product.imagen} alt={product.nombre} />
              <div>
                <span>{product.categoria}</span>
                <h3>{product.nombre}</h3>
                <strong>Bs. {product.precio}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default CategoryPage;
