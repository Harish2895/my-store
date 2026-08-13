"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "../lib/cart-context";
import Link from "next/link";

export default function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="relative">
      <ShoppingBag size={22} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}