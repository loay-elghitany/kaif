import React, { useState } from "react";

export default function ProductCard({ product, onAdd }) {
  const variants = product.sizes?.length
    ? product.sizes
    : [{ size: "", price: product.price }];
  const [selectedSize, setSelectedSize] = useState(variants[0]);

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col">
      <div className="h-56 w-full relative">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-56"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-1">
          {product.description}
        </p>
        {product.sizes?.length > 0 && (
          <div className="mb-4">
            <label
              htmlFor={`size-${product.id}`}
              className="block text-sm font-medium mb-2"
            >
              اختر الحجم
            </label>
            <select
              id={`size-${product.id}`}
              value={selectedSize.size}
              onChange={(event) =>
                setSelectedSize(
                  variants.find(
                    (variant) => variant.size === event.target.value,
                  ),
                )
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              {variants.map((variant) => (
                <option key={variant.size} value={variant.size}>
                  {variant.size}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xl font-bold">{selectedSize.price} ج.م</div>
          <button
            onClick={() => onAdd(product, selectedSize)}
            className="bg-black text-white px-3 py-2 rounded-md text-sm"
          >
            أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
}
