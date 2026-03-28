"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";

export function PageHeader({ onCartClick }: { onCartClick?: () => void }) {
  const { itemCount } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-orange-300/85 bg-orange-200/92 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2 md:px-10">
        <div className="relative h-12 w-56 overflow-hidden rounded-md sm:h-14 sm:w-64 md:h-16 md:w-72">
          <Image
            src="/images/pixelorpaperLogo.png"
            alt="Pixel or Paper logo"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <button
          onClick={onCartClick}
          className="rounded-full border border-zinc-900 px-4 py-1.5 text-sm font-semibold tracking-wide transition hover:-translate-y-0.5 hover:bg-zinc-900 hover:text-orange-50"
          type="button"
        >
          Cart ({itemCount})
        </button>
      </div>
    </header>
  );
}
