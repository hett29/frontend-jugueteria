import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import Categories from "../components/Categories";
import Products from "../components/Products";
import BottomNav from "../components/BottomNav";
import Cart, { type CartItem } from "../components/Cart";

import { products, type Product } from "../data/products";

import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  // Usuario que inició sesión
  const user = authRepository.getCurrentUser();

  // Buscador
  const [search, setSearch] = useState("");

  // Carrito
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState("");

  // Cantidad total de productos en el carrito
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Ocultar notificación después de 3 segundos
  useEffect(() => {
    if (!notification) return;

    const timeoutId = window.setTimeout(() => {
      setNotification("");
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  // Filtrar productos
  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Agregar producto al carrito
  const handleAddProduct = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          product,
          quantity: 1,
        },
      ];
    });

    setNotification(`${product.nombre} se agregó al carrito`);
  };

  // Disminuir cantidad del producto
  const handleDecreaseProduct = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.product.id !== productId) {
          return [item];
        }

        if (item.quantity === 1) {
          return [];
        }

        return [
          {
            ...item,
            quantity: item.quantity - 1,
          },
        ];
      })
    );
  };

  // Cerrar sesión
  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="home-page">

      {/* Notificación */}
      {notification && (
        <div
          className="cart-notification"
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true">✓</span>
          {notification}
        </div>
      )}

      {/* NAVBAR */}
      <Navbar
        cartCount={cartCount}
        user={user}
        onLogout={handleLogout}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main>
        {isCartOpen ? (
          <Cart
            items={cartItems}
            onIncrease={handleAddProduct}
            onDecrease={handleDecreaseProduct}
            onContinueShopping={() => setIsCartOpen(false)}
          />
        ) : (
          <>
            <SearchBar
              search={search}
              setSearch={setSearch}
            />

            <HeroBanner />

            <Categories />

            <Products
              products={filteredProducts}
              onAdd={handleAddProduct}
            />
          </>
        )}
      </main>

      {/* NAVEGACIÓN INFERIOR */}
      <BottomNav
        isCartOpen={isCartOpen}
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => setIsCartOpen(false)}
      />

    </div>
  );
}

export default HomePage;