import React, { useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  function addToCart(product, selectedSize) {
    const cartItemId = `${product.id}-${selectedSize.size || "default"}`;
    const cartItem = {
      ...product,
      id: cartItemId,
      productId: product.id,
      size: selectedSize.size,
      price: selectedSize.price,
      quantity: 1,
    };

    setCartItems((prev) => {
      const exists = prev.find((p) => p.id === cartItemId);
      if (exists)
        return prev.map((p) =>
          p.id === cartItemId ? { ...p, quantity: p.quantity + 1 } : p,
        );
      return [cartItem, ...prev];
    });
  }

  const totalCount = cartItems.reduce((s, it) => s + it.quantity, 0);

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">كيف — Kaif</h1>
        <div className="text-gray-600">مجموعة العطور الفاخرة</div>
      </header>

      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </section>

      <button
        onClick={() => setCartOpen(true)}
        className="fixed left-6 bottom-6 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
      >
        <div className="text-sm">{totalCount}</div>
      </button>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </main>
  );
}
