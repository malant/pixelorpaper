"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";

export function PageHeader({ onCartClick }: { onCartClick?: () => void }) {
  const { itemCount } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-zinc-200/70 bg-orange-50/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-4 pt-4 md:px-10">
        <div className="min-w-0">
          <Image
            src="/images/unframed-logo-editorial.svg"
            alt="UNFRAMED logo"
            width={720}
            height={200}
            priority
            className="h-auto w-48 max-w-full sm:w-64 md:w-80"
          />
        </div>

        <button
          onClick={onCartClick}
          className="rounded-full border border-zinc-900 px-5 py-2 text-sm font-semibold tracking-wide transition hover:-translate-y-0.5 hover:bg-zinc-900 hover:text-orange-50"
          type="button"
        >
          Cart ({itemCount})
        </button>
      </div>
    </header>
  );
}
