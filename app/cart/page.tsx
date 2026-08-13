"use client";

import { useCart } from "../lib/cart-context";
import Link from "next/link";
import { Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong starting checkout.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong starting checkout.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="container-x py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/" className="text-emerald-600 font-medium hover:underline">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container-x py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8">
        <ArrowLeft size={16} />
        Continue shopping
      </Link>

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="flex flex-col gap-6 mb-10">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 pb-6">
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-xl bg-gray-100"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-500">${item.price}</p>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold mb-2">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-200 pt-6">
        <span className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</span>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          {loading ? "Redirecting..." : "Checkout"}
        </button>
      </div>
    </main>
  );
}