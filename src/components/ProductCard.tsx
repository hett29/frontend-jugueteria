import type { Product } from "../data/products";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

function ProductCard({
  product,
  onAdd,
}: ProductCardProps) {
  return (
    <article className="product-card">

      <div className="product-image">
        <img
          src={product.imagen}
          alt={product.nombre}
        />
      </div>

      <h3>
        {product.nombre}
      </h3>

      <p>
        Bs. {product.precio}
      </p>

      <button
        className="add-product"
        onClick={() => onAdd(product)}
      >
        +
      </button>

    </article>
  );
}

export default ProductCard;