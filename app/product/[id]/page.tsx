import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, ShieldCheck } from "lucide-react";
import AddToCartButton from "@/app/components/AddToCartButton";

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="container-x py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8">
        <ArrowLeft size={16} />
        Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-2xl text-emerald-600 font-semibold mb-6">${product.price}</p>
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description || "No description available yet."}
          </p>

          <AddToCartButton product={product} />

          <div className="flex flex-col gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-emerald-500" />
              Free shipping on orders over $50
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              Secure checkout, money-back guarantee
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}