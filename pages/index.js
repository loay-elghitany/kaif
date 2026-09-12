import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";

const categories = [
  { id: "All", label: "All" },
  { id: "Men", label: "Men" },
  { id: "Women", label: "Women" },
  { id: "Unisex", label: "Unisex" },
];

function normalizeCategory(product) {
  const value = (product?.category || product?.genus || "Unisex").toLowerCase();

  if (["men", "male", "رجالي"].includes(value)) return "Men";
  if (["women", "female", "نسائي", "انثى", "lady"].includes(value))
    return "Women";
  return "Unisex";
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(timeout);
  }, [toast]);

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
      const exists = prev.find((item) => item.id === cartItemId);
      if (exists) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [cartItem, ...prev];
    });

    setToast(`${product.name} added to cart`);
    setCartOpen(true);
  }

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "All" ||
        normalizeCategory(product) === activeCategory;
      const searchText = [
        product.name,
        product.description,
        product.genus,
        product.category,
        product.notes || "",
      ]
        .join(" ")
        .toLowerCase();

      const queryMatch =
        !normalizedSearch || searchText.includes(normalizedSearch);

      return categoryMatch && queryMatch;
    });
  }, [activeCategory, searchTerm]);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
              ك
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">Kaif</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                fragrance house
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-900"
          >
            <span>Cart</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-900 px-1.5 text-xs font-bold text-white">
              {totalCount}
            </span>
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 lg:pt-8">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-200">
          <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div className="flex flex-col justify-center">
              <span className="mb-3 inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-200">
                Curated luxury scents
              </span>
              <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Signature fragrances that feel personal.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Discover premium scents crafted for every mood — from refreshing
                citrus blends to warm woody signatures that linger beautifully.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                >
                  Shop collection
                </button>
                <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {totalCount} items ready to order
                </div>
              </div>
            </div>

            <div className="relative min-h-[260px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/5 to-white/0">
              <Image
                src="/images/IMG-20260812-WA0016.jpg"
                alt="Kaif perfume hero"
                fill
                priority
                className="object-cover opacity-90"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10" />
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/10 bg-white/5 p-4 sm:grid-cols-3 sm:p-5">
            {["Fast Shipping", "Cash on Delivery", "100% Authentic Scents"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-slate-100"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="relative block w-full md:max-w-md">
              <span className="sr-only">Search perfumes</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or scent notes..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                ⌕
              </span>
            </label>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    activeCategory === category.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                category: normalizeCategory(product),
                featured: product.id <= 4,
                popular: product.id % 5 === 0,
              }}
              onAdd={addToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            No fragrances match your search. Try another note or category.
          </div>
        )}
      </section>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </main>
  );
}
