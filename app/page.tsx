import Link from "next/link";
import { Truck, ShieldCheck, Star } from "lucide-react";
import { supabase } from "./lib/supabase";
import CartButton from "./components/CartButton";

async function getProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="container-x flex items-center justify-between h-16">
          <span className="text-xl font-bold tracking-tight">Aurora</span>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="#shop" className="hover:text-black">Shop</a>
            <a href="#" className="hover:text-black">About</a>
            <a href="#" className="hover:text-black">Contact</a>
          </nav>
          <CartButton />
        </div>
      </header>

      <section className="bg-gray-900 text-white">
        <div className="container-x py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Everyday essentials, designed to last.
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            Thoughtfully made products for modern living. Free shipping over $50.
          </p>
          <a href="#shop" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3 rounded-full transition">
            Shop the Collection
          </a>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="container-x py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck size={26} className="text-emerald-500" />
            <p className="text-sm font-medium">Free shipping over $50</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck size={26} className="text-emerald-500" />
            <p className="text-sm font-medium">Secure checkout</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Star size={26} className="text-emerald-500" />
            <p className="text-sm font-medium">Rated 4.9/5 by customers</p>
          </div>
        </div>
      </section>

      <section id="shop" className="container-x py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Featured Products</h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products found. Add some in Supabase!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group block">
                <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-gray-500">${product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-x text-center text-sm">
          <p className="text-white font-bold text-lg mb-2">Aurora</p>
          <p>© 2026 Aurora Store. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}