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
import PaymentMethods from "../components/PaymentMethods";
import Account from "../components/Account";
import AdminDashboard from "../components/AdminDashboard";

import { products, type Product } from "../data/products";
import { purchaseRepository } from "../repositories/purchaseRepository";
import { createPurchaseItems } from "../types/purchase";

import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPurchaseConfirmed, setIsPurchaseConfirmed] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const purchases = user ? purchaseRepository.getByUserId(user.id) : [];

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const quantities = Object.fromEntries(cartItems.map(({ product, quantity }) => [product.id, quantity])) as Record<number, number>;

  useEffect(() => {
    if (!notification) return;
    const timeoutId = window.setTimeout(() => setNotification(""), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return currentItems.map((item) => item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item);
      }
      return [...currentItems, { product, quantity: 1 }];
    });
    setNotification(`${product.nombre} se agregó al carrito`);
  };

  const handleDecreaseProduct = (productId: number) => {
    setCartItems((currentItems) => currentItems.flatMap((item) => {
      if (item.product.id !== productId) return [item];
      if (item.quantity === 1) return [];
      return [{ ...item, quantity: item.quantity - 1 }];
    }));
  };

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  const handleConfirmPurchase = (paymentMethod: string) => {
    if (!user) {
      setNotification("Inicia sesión para registrar tu pedido.");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) return;
    if (!user.department || !user.city) {
      setNotification("Primero completa tu departamento y ciudad en Mi cuenta.");
      setIsPaymentOpen(false);
      setIsPurchaseConfirmed(false);
      setIsAccountOpen(true);
      return;
    }

    purchaseRepository.create(
      user.id,
      createPurchaseItems(cartItems),
      paymentMethod,
      { department: user.department, city: user.city },
    );
    setCartItems([]);
    setIsCartOpen(false);
    setIsPurchaseConfirmed(true);
    setIsAccountOpen(false);
    setNotification("Pedido registrado. Está pendiente de revisión del administrador.");
  };

  if (user?.role === "ADMIN") {
    return <main className="home-page admin-home"><AdminDashboard onLogout={handleLogout} /></main>;
  }

  return (
    <div className="home-page">
      {notification && (
        <div className="cart-notification" role="status" aria-live="polite">
          <span aria-hidden="true">✓</span>{notification}
        </div>
      )}

      <Navbar
        cartCount={cartCount}
        user={user}
        onLogout={handleLogout}
        onCartClick={() => {
          setIsCartOpen(true);
          setIsPaymentOpen(false);
          setIsAccountOpen(false);
        }}
      />

      <main>
        {isPaymentOpen ? (
          <PaymentMethods
            items={cartItems}
            isPurchaseConfirmed={isPurchaseConfirmed}
            onBackToCart={() => { setIsPaymentOpen(false); setIsPurchaseConfirmed(false); }}
            onConfirm={handleConfirmPurchase}
            onViewPurchases={() => {
              setIsPaymentOpen(false);
              setIsPurchaseConfirmed(false);
              setIsAccountOpen(true);
            }}
          />
        ) : isAccountOpen ? (
          <Account
            user={user}
            purchases={purchases}
            onUpdateLocation={(department, city) => {
              authRepository.updateProfile(user!.id, { department, city });
              setNotification("Tu ubicación se guardó correctamente.");
            }}
          />
        ) : isCartOpen ? (
          <Cart
            items={cartItems}
            onIncrease={handleAddProduct}
            onDecrease={handleDecreaseProduct}
            onContinueShopping={() => {
              setIsCartOpen(false);
              setIsPaymentOpen(false);
              setIsAccountOpen(false);
            }}
            onProceedToPayment={() => {
              if (!user) {
                setNotification("Inicia sesión para registrar tu pedido.");
                navigate("/login");
                return;
              }
              setIsPaymentOpen(true);
              setIsPurchaseConfirmed(false);
            }}
          />
        ) : (
          <>
            <SearchBar search={search} setSearch={setSearch} />
            <HeroBanner />
            <Categories />
            <Products
              products={filteredProducts}
              quantities={quantities}
              onAdd={handleAddProduct}
              onDecrease={handleDecreaseProduct}
            />
          </>
        )}
      </main>

      <BottomNav
        activeView={isAccountOpen ? "account" : isPaymentOpen ? "payment" : isCartOpen ? "cart" : "home"}
        onCartClick={() => { setIsCartOpen(true); setIsPaymentOpen(false); setIsAccountOpen(false); }}
        onHomeClick={() => { setIsCartOpen(false); setIsPaymentOpen(false); setIsAccountOpen(false); }}
        onPaymentClick={() => {
          if (!user) {
            setNotification("Inicia sesión para registrar tu pedido.");
            navigate("/login");
            return;
          }
          setIsCartOpen(false);
          setIsPaymentOpen(true);
          setIsPurchaseConfirmed(false);
          setIsAccountOpen(false);
        }}
        onAccountClick={() => { setIsCartOpen(false); setIsPaymentOpen(false); setIsAccountOpen(true); }}
      />
    </div>
  );
}

export default HomePage;
