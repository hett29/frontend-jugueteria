
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authRepository } from "../repositories/authRepository";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import Categories from "../components/Categories";
import Products from "../components/Products";
import BottomNav from "../components/BottomNav";

import { products } from "../data/products";

import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  // Usuario que inició sesión
  const user = authRepository.getCurrentUser();

  // Buscador
  const [search, setSearch] = useState("");

  // Cantidad de productos en carrito
  const [cartCount, setCartCount] = useState(0);

  // Filtrar productos
  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Agregar producto
  const handleAddProduct = () => {
    setCartCount((prev) => prev + 1);
  };

  // Cerrar sesión
  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="home-page">

      {/* =========================
          NAVBAR
      ========================== */}
      <Navbar
        cartCount={cartCount}
        user={user}
        onLogout={handleLogout}
      />

      {/* =========================
          CONTENIDO PRINCIPAL
      ========================== */}
      <main>

        {/* Buscador */}
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        {/* Banner */}
        <HeroBanner />

        {/* Categorías */}
        <Categories />

        {/* Productos */}
        <Products
          products={filteredProducts}
          onAdd={handleAddProduct}
        />

      </main>

      {/* =========================
          NAVEGACIÓN INFERIOR
      ========================== */}
      <BottomNav />

    </div>
  );
}

export default HomePage;
