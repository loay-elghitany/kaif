import React, { useMemo, useState } from "react";
import Image from "next/image";
import { phoneNumber } from "../data/config";

function formatSize(size) {
  if (!size) return "Standard";
  return String(size).replace(/(\d+)\s*ml\b/i, "$1 ml");
}

function formatWhatsAppMessage(items, total, customerDetails) {
  const lines = [
    "New order from Kaif",
    "--------------------",
    `Customer Name: ${customerDetails.name}`,
    `Phone: ${customerDetails.phone}`,
    `Address: ${customerDetails.address}`,
    "",
    "Items:",
  ];

  items.forEach((item) => {
    lines.push(
      `- ${item.name} (${formatSize(item.size)}) | Unit Price: ${item.price} EGP | Qty: ${item.quantity} | Total: ${item.quantity * item.price} EGP`,
    );
  });

  lines.push("", `Total Order: ${total} EGP`);
  return encodeURIComponent(lines.join("\n"));
}

export default function CartDrawer({ open, onClose, cartItems, setCartItems }) {
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  function updateField(field, value) {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validateDetails() {
    const nextErrors = {};

    if (!customerDetails.name.trim())
      nextErrors.name = "Please enter your full name.";
    if (!customerDetails.phone.trim())
      nextErrors.phone = "Please enter your phone number.";
    if (!customerDetails.address.trim()) {
      nextErrors.address = "Please enter your city and detailed address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function changeQty(id, delta) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  }

  function removeItem(id) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  function openWhatsApp() {
    if (!validateDetails()) return;

    const message = formatWhatsAppMessage(cartItems, total, customerDetails);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-slate-950/55" onClick={onClose} />
      <aside className="relative ml-auto h-full w-full max-w-md overflow-y-auto bg-white p-4 shadow-2xl sm:p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Cart
            </p>
            <h2 className="text-2xl font-black text-slate-900">Your order</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600"
          >
            Close
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            Your cart is empty.
          </div>
        ) : (
          <div className="space-y-5">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-slate-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatSize(item.size)}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {item.price} ج.م
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeQty(item.id, -1)}
                      className="h-7 w-7 rounded-full border border-slate-200 bg-white text-base font-bold text-slate-700"
                    >
                      −
                    </button>
                    <span className="min-w-5 text-center text-sm font-semibold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQty(item.id, 1)}
                      className="h-7 w-7 rounded-full border border-slate-200 bg-white text-base font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Item total</span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="font-medium text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-4 space-y-3">
                <div>
                  <label
                    htmlFor="customer-name"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    value={customerDetails.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="customer-phone"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    value={customerDetails.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                    placeholder="e.g. 01012345678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="customer-address"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Detailed Address / City
                  </label>
                  <textarea
                    id="customer-address"
                    rows={3}
                    value={customerDetails.address}
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                    placeholder="Street, area, city"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="my-4 flex items-center justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span>{total} ج.م</span>
              </div>

              <button
                type="button"
                onClick={openWhatsApp}
                className="w-full rounded-full bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-500"
              >
                Checkout via WhatsApp
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
