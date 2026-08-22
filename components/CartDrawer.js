import React from "react";
import { phoneNumber } from "../data/config";

function formatSize(size) {
  if (!size) return "الأساسي";
  return String(size).replace(/(\d+)\s*ml\b/i, "$1 مل");
}

function formatWhatsAppMessage(items, total) {
  let lines = [];
  lines.push("طلب من Kaif (كيف)");
  lines.push("--------------------");
  items.forEach((it) => {
    lines.push(
      `${it.name} (الحجم: ${formatSize(it.size)}) - الكمية: ${it.quantity} - السعر: ${it.quantity * it.price} ج.م`,
    );
  });
  lines.push("--------------------");
  lines.push(`المجموع: ${total} ج.م`);
  return encodeURIComponent(lines.join("\n"));
}

export default function CartDrawer({ open, onClose, cartItems, setCartItems }) {
  const total = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);

  function changeQty(id, delta) {
    setCartItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, quantity: Math.max(1, it.quantity + delta) }
          : it,
      ),
    );
  }

  function removeItem(id) {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  }

  function openWhatsApp() {
    const msg = formatWhatsAppMessage(cartItems, total);
    const url = `https://wa.me/${phoneNumber}?text=${msg}`;
    window.open(url, "_blank");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside
        className="relative bg-white w-96 p-4 h-full overflow-auto"
        dir="rtl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">سلة المشتريات</h2>
          <button onClick={onClose} className="text-gray-600">
            إغلاق
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-gray-600">السلة فارغة</div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((it) => (
              <div key={it.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={it.image}
                    className="w-16 h-16 object-cover rounded"
                    alt={it.name}
                  />
                  <div>
                    <div className="font-semibold">
                      {it.name} ({formatSize(it.size)})
                    </div>
                    <div className="text-sm text-gray-500">{it.price} ج.م</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeQty(it.id, -1)}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <div>{it.quantity}</div>
                  <button
                    onClick={() => changeQty(it.id, 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-sm text-red-500"
                  >
                    إزالة
                  </button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex items-center justify-between font-bold mb-3">
                المجموع <span>{total} ج.م</span>
              </div>
              <button
                onClick={openWhatsApp}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                إتمام الطلب عبر واتساب
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
