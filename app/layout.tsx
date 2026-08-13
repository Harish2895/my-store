import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./lib/cart-context";

export const metadata: Metadata = {
  title: "Aurora Store",
  description: "Everyday essentials, designed to last.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}