"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useCart } from "../lib/cart-context";

export default function SuccessPage() {
  const { clearCart, isLoaded } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (isLoaded && !hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [isLoaded, clearCart]);

  return (
    <main className="container-x py-24 text-center">
      <CheckCircle size={64} className="text-emerald-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">Thank you for your order. A confirmation is on its way.</p>
      <Link
        href="/"
        className="inline-block bg-gray-900 hover:bg-black text-white font-semibold px-8 py-3 rounded-full transition"
      >
        Continue Shopping
      </Link>
    </main>
  );
}