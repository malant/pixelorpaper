"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { resolveProductImage } from "@/lib/images";
import { getProductAltText } from "@/lib/seo";
import { PageHeader } from "@/components/page-header";
import type { Product } from "@/types/product";

const categories = [
  "All",
  "Landscapes",
  "Cityscapes",
  "Buildings",
  "Nature",
  "Misc",
] as const;
type Category = (typeof categories)[number];

function toCategory(value: string | undefined): Category {
  if (!value) {
    return "All";
  }

  return (categories as readonly string[]).includes(value)
    ? (value as Category)
    : "All";
}

export function Storefront({
  products,
  initialCategory,
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const currentYear = new Date().getFullYear();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>(
    toCategory(initialCategory),
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { cart, itemCount, subtotalCents, removeFromCart, clearCart } =
    useCart();

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") {
      return products;
    }

    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCartOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen]);

  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "IMG" ||
        target.closest("[data-secure-image]") ||
        target.closest("article")
      ) {
        event.preventDefault();
      }
    };

    const preventDrag = (event: DragEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "IMG" || target.closest("[data-secure-image]")) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu, false);
    document.addEventListener("dragstart", preventDrag, false);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu, false);
      document.removeEventListener("dragstart", preventDrag, false);
    };
  }, []);

  const checkout = async () => {
    if (cart.length === 0) {
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            purchaseType: item.variant.kind,
            printSizeKey:
              item.variant.kind === "print"
                ? item.variant.printSizeKey
                : undefined,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const payload = (await response.json()) as { url?: string };
      if (payload.url) {
        window.location.href = payload.url;
      }
    } catch {
      alert(
        "Checkout could not be started. Confirm your Stripe keys in .env.local.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-orange-50/90">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,167,122,0.42)_0%,rgba(255,167,122,0)_70%)]" />

      <PageHeader onCartClick={() => setIsCartOpen((value) => !value)} />

      <section className="mx-auto mb-8 flex w-full max-w-6xl flex-wrap gap-3 px-6 pt-24 md:px-10 md:pt-28">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === category
                ? "bg-zinc-900 text-orange-50"
                : "bg-white/70 text-zinc-700 hover:bg-white"
            }`}
            type="button"
          >
            {category}
          </button>
        ))}
      </section>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-6 md:grid-cols-2 md:px-10 lg:grid-cols-3">
        {visibleProducts.map((product, index) => (
          <article
            key={product.id}
            id={`gallery-item-${product.id}`}
            className="group rounded-3xl border border-zinc-200 bg-white/85 p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Link
              href={`/product/${product.id}?category=${encodeURIComponent(activeCategory)}&returnTo=${encodeURIComponent(product.id)}`}
              className="block"
            >
              <div
                className="relative mb-4 aspect-5/4 overflow-hidden rounded-2xl bg-zinc-100"
                data-secure-image
              >
                <Image
                  src={resolveProductImage(product.image)}
                  alt={getProductAltText(product)}
                  fill
                  priority={index === 0}
                  className="pointer-events-none select-none object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-900/70">
              {product.artist}
            </p>
            <h2 className="mb-2 text-2xl font-bold text-zinc-900">
              {product.title}
            </h2>
            <p className="mb-2 text-sm text-zinc-600">{product.size}</p>
            <p className="mb-4 text-sm text-zinc-600">{product.description}</p>
            <Link
              href={`/product/${product.id}?category=${encodeURIComponent(activeCategory)}&returnTo=${encodeURIComponent(product.id)}`}
              className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-orange-50 transition hover:bg-zinc-700"
            >
              View details and order
            </Link>
          </article>
        ))}
      </main>

      <footer className="mt-14 border-t border-orange-300/85 bg-orange-200/92 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-6 py-2 md:flex-row md:items-center md:px-10">
          <div className="relative h-10 w-52 overflow-hidden rounded-md md:h-12 md:w-64">
            <Image
              src="/images/pixelorpaperLogo.png"
              alt="Pixel or Paper logo"
              fill
              className="object-cover object-center"
            />
          </div>
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-700">
            Copyright {currentYear}. All rights reserved.
          </p>
        </div>
      </footer>

      {isCartOpen ? (
        <button
          type="button"
          aria-label="Close cart"
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 z-15 bg-zinc-900/30 backdrop-blur-xs"
        />
      ) : null}

      <aside
        className={`fixed right-0 top-0 z-20 h-full w-full max-w-md border-l border-zinc-200 bg-orange-50/95 p-6 shadow-xl backdrop-blur-md transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-zinc-900">Your cart</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            type="button"
            className="text-sm font-semibold text-zinc-700"
          >
            Close
          </button>
        </div>

        <div className="flex h-[calc(100%-8rem)] flex-col justify-between gap-4">
          <div className="space-y-3 overflow-y-auto pr-2">
            {cart.length === 0 ? (
              <p className="rounded-xl bg-white p-4 text-sm text-zinc-600">
                No prints yet. Add one from the gallery.
              </p>
            ) : (
              cart.map((item) => {
                const product = item.product;

                return (
                  <div key={item.lineId} className="rounded-xl bg-white p-4">
                    <p className="text-sm font-semibold text-zinc-900">
                      {product.title}
                    </p>
                    <p className="text-xs text-zinc-600">{item.variantLabel}</p>
                    <p className="mb-2 text-xs text-zinc-600">
                      x{item.quantity}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-700">
                        {formatPrice(item.unitPriceCents * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.lineId)}
                        type="button"
                        className="text-xs font-semibold uppercase tracking-wide text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-zinc-700">
              <span>Subtotal</span>
              <strong className="text-lg text-zinc-900">
                {formatPrice(subtotalCents)}
              </strong>
            </div>
            <button
              onClick={checkout}
              disabled={cart.length === 0 || isCheckingOut}
              type="button"
              className="w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-orange-50 transition enabled:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isCheckingOut ? "Starting checkout..." : "Checkout with Stripe"}
            </button>
            <button
              onClick={clearCart}
              disabled={cart.length === 0}
              type="button"
              className="w-full rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear cart
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
