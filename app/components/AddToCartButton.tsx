"use client";

import { useCart } from "../lib/cart-context";
import { useState } from "react";

type Props = {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-full transition mb-6"
    >
      {added ? "Added! ✓" : "Add to Cart"}
    </button>
  );
}