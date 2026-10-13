import type { Product } from "../data/products";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onDecrease: (productId: number) => void;
}

function ProductCard({ product, quantity, onAdd, onDecrease }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-image"><img src={product.imagen} alt={product.nombre} /></div>
      <h3>{product.nombre}</h3>
      <p>Bs. {product.precio}</p>
      <div className="product-quantity-controls" aria-label={`Cantidad de ${product.nombre}`}>
        <button type="button" onClick={() => onDecrease(product.id)} disabled={quantity === 0} aria-label={`Disminuir ${product.nombre}`}>−</button>
        <span aria-live="polite">{quantity}</span>
        <button type="button" onClick={() => onAdd(product)} aria-label={`Aumentar ${product.nombre}`}>+</button>
      </div>
    </article>
  );
}

export default ProductCard;
