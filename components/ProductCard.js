import React, { useState } from "react";
import Image from "next/image";

export default function ProductCard({ product, onAdd }) {
  const variants = product.sizes?.length
    ? product.sizes
    : [{ size: "", price: product.price }];
  const [selectedSize, setSelectedSize] = useState(variants[0]);

  const badge = product.featured
    ? "Featured"
    : product.popular
      ? "Popular"
      : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-64 overflow-hidden">
        {badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900">
            {badge}
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {product.category || product.genus || "Unisex"}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
            {product.notes || "Fresh blend"}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {product.description}
        </p>

        {product.sizes?.length > 0 && (
          <div className="mt-4">
            <label
              htmlFor={`size-${product.id}`}
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Size
            </label>
            <select
              id={`size-${product.id}`}
              value={selectedSize.size}
              onChange={(event) => {
                const nextVariant = variants.find(
                  (variant) => variant.size === event.target.value,
                );
                if (nextVariant) setSelectedSize(nextVariant);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            >
              {variants.map((variant) => (
                <option key={variant.size || "default"} value={variant.size}>
                  {variant.size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Price
            </div>
            <div className="text-2xl font-black text-slate-900">
              {selectedSize.price} ج.م
            </div>
          </div>

          <button
            type="button"
            onClick={() => onAdd(product, selectedSize)}
            className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
