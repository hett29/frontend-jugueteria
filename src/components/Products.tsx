import type { Product } from "../data/products";
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
    <section className="products-section">

      <div className="section-header">
        <h2>Productos destacados</h2>

        <button>
          Ver todos
        </button>
      </div>

      <div className="products-grid">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
          />
        ))}

      </div>

    </section>
  );
}

export default Products;