"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";

export interface PageHeaderProps {
  onCartClick?: () => void;
}

export function PageHeader({ onCartClick }: PageHeaderProps) {
  const { itemCount } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-orange-300/85 bg-orange-200/92 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2 md:px-10">
        <div className="relative h-10 w-52 overflow-hidden rounded-md md:h-12 md:w-64">
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
          className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-800 underline-offset-4 transition hover:text-zinc-950 hover:underline"
          type="button"
        >
          Cart ({itemCount})
        </button>
      </div>
    </header>
  );
}
