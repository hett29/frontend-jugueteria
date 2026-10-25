
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

type View = "home" | "cart" | "payment" | "account";

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const isDistributor = user?.role === "DISTRIBUIDOR";
  const quantityStep = isDistributor ? 12 : 1;

  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeView, setActiveView] = useState<View>("home");
  const [isPurchaseConfirmed, setIsPurchaseConfirmed] = useState(false);
  const [notification, setNotification] = useState("");

  const purchases = user
    ? purchaseRepository.getByUserId(user.id)
    : [];

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const quantities = Object.fromEntries(
    cartItems.map(({ product, quantity }) => [
      product.id,
      quantity,
    ])
  ) as Record<number, number>;

  useEffect(() => {
    if (!notification) return;

    const timeoutId = window.setTimeout(
      () => setNotification(""),
      3500
    );

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const getProductForCart = (product: Product): Product => ({
    ...product,
    precio: isDistributor
      ? Math.round(product.precio * 0.8 * 100) / 100
      : product.precio,
  });

  const handleAddProduct = (product: Product) => {
    const productForCart = getProductForCart(product);

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                product: productForCart,
                quantity: item.quantity + quantityStep,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          product: productForCart,
          quantity: quantityStep,
        },
      ];
    });

    setNotification(
      isDistributor
        ? `${product.nombre}: se agregaron 12 unidades al carrito.`
        : `${product.nombre} se agregó al carrito.`
    );
  };

  const handleDecreaseProduct = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.product.id !== productId) {
          return [item];
        }

        const newQuantity = item.quantity - quantityStep;

        if (newQuantity <= 0) {
          return [];
        }

        return [{ ...item, quantity: newQuantity }];
      })
    );
  };

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

const handleUpdateLocation = (
  department: string,
  city: string
) => {
  if (!user) return;

  const updatedUser = authRepository.updateProfile(user.id, {
    department: department.trim(),
    city: city.trim(),
  });

  if (!updatedUser) {
    setNotification(
      "No se pudo guardar la ubicación. Vuelve a iniciar sesión."
    );
    return;
  }

  setNotification("Tu ubicación se guardó correctamente.");
};

  const handleConfirmPurchase = (paymentMethod: string) => {
    if (!user) {
      setNotification("Inicia sesión para registrar tu pedido.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setNotification("Tu carrito está vacío.");
      setActiveView("cart");
      return;
    }

    if (!user.department || !user.city) {
      setNotification(
        "Completa tu departamento y ciudad en la sección Cuenta antes de continuar."
      );
      setActiveView("account");
      return;
    }

    purchaseRepository.create(
      user.id,
      createPurchaseItems(cartItems),
      paymentMethod,
      {
        department: user.department,
        city: user.city,
      }
    );

    setCartItems([]);
    setIsPurchaseConfirmed(true);
    setActiveView("payment");
    setNotification(
      "Pedido registrado. Está pendiente de revisión del administrador."
    );
  };

  if (user?.role === "ADMIN") {
    return (
      <main className="home-page admin-home">
        <AdminDashboard onLogout={handleLogout} />
      </main>
    );
  }

  return (
    <div className="home-page">
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

      <Navbar
        cartCount={cartCount}
        user={user}
        onLogout={handleLogout}
        onCartClick={() => {
          setActiveView("cart");
          setIsPurchaseConfirmed(false);
        }}
      />

      <main>
        {activeView === "home" && (
          <>
            <SearchBar
              search={search}
              setSearch={setSearch}
            />
            <HeroBanner />
            <Categories />
            <Products
              products={filteredProducts}
              quantities={quantities}
              isDistributor={isDistributor}
              onAdd={handleAddProduct}
              onDecrease={handleDecreaseProduct}
            />
          </>
        )}

        {activeView === "cart" && (
          <Cart
            items={cartItems}
            isDistributor={isDistributor}
            onIncrease={handleAddProduct}
            onDecrease={handleDecreaseProduct}
            onContinueShopping={() => setActiveView("home")}
            onProceedToPayment={() => {
              setIsPurchaseConfirmed(false);
              setActiveView("payment");
            }}
          />
        )}

        {activeView === "payment" && (
          <PaymentMethods
            items={cartItems}
            isPurchaseConfirmed={isPurchaseConfirmed}
            onBackToCart={() => setActiveView("cart")}
            onConfirm={handleConfirmPurchase}
            onViewPurchases={() => {
              setIsPurchaseConfirmed(false);
              setActiveView("account");
            }}
          />
        )}

        {activeView === "account" && (
          <Account
            user={user}
            purchases={purchases}
            onUpdateLocation={handleUpdateLocation}
          />
        )}
      </main>

      <BottomNav
        activeView={activeView}
        onHomeClick={() => {
          setActiveView("home");
          setIsPurchaseConfirmed(false);
        }}
        onCartClick={() => setActiveView("cart")}
        onPaymentClick={() => setActiveView("payment")}
        onAccountClick={() => setActiveView("account")}
      />
    </div>
  );
}

export default HomePage;
