import type { Product } from "../data/products";
import { categories } from "../data/categories";
import ProductCard from "./ProductCard";
import "./Products.css";

interface ProductsProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

function Products({
  products,
  onAdd,
}: ProductsProps) {
  return (
    <section className="products-section" id="catalogo">

      <div className="section-header">
        <h2>Productos por categoría</h2>
      </div>

      {categories.map((category) => {
        const categoryProducts = products.filter(category.includes);

        if (categoryProducts.length === 0) {
          return null;
        }

        return (
          <section
            className="product-category"
            id={category.id}
            key={category.id}
          >
            <h3>{category.nombre}</h3>

            <div className="products-grid">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={onAdd}
                />
              ))}
            </div>
          </section>
        );
      })}

    </section>
  );
}

export default Products;
