
import type { Product } from "../data/products";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  quantity: number;
  isDistributor: boolean;
  onAdd: (product: Product) => void;
  onDecrease: (productId: number) => void;
}

function ProductCard({
  product,
  quantity,
  isDistributor,
  onAdd,
  onDecrease,
}: ProductCardProps) {
  const displayedPrice = isDistributor
    ? Math.round(product.precio * 0.8 * 100) / 100
    : product.precio;

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.imagen} alt={product.nombre} />
      </div>

      <h3>{product.nombre}</h3>

      <p>
        Bs. {displayedPrice}
        {isDistributor && (
          <span className="wholesale-label"> Precio mayorista</span>
        )}
      </p>

      {isDistributor && (
        <p className="wholesale-minimum">Compra mínima: 12 unidades</p>
      )}

      <div
        className="product-quantity-controls"
        aria-label={`Cantidad de ${product.nombre}`}
      >
        <button
          type="button"
          onClick={() => onDecrease(product.id)}
          disabled={quantity === 0}
          aria-label={`Disminuir ${product.nombre}`}
        >
          −
        </button>

        <span aria-live="polite">{quantity}</span>

        <button
          type="button"
          onClick={() => onAdd(product)}
          aria-label={`Aumentar ${product.nombre}`}
        >
          +
        </button>
      </div>

      {isDistributor && (
        <p className="wholesale-increment">Incrementos de 12 unidades</p>
      )}
    </article>
  );
}

export default ProductCard;
