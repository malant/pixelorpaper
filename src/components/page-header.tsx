"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";

export interface PageHeaderProps {
  onCartClick?: () => void;
  isExpanded?: boolean;
  backgroundImage?: string;
  shrinkOnScroll?: boolean;
}

export function PageHeader({
  onCartClick,
  isExpanded = false,
  backgroundImage,
  shrinkOnScroll = false,
}: PageHeaderProps) {
  const { itemCount } = useCart();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (!isExpanded || !shrinkOnScroll) {
      setIsCompact(false);
      return;
    }

    const onScroll = () => {
      setIsCompact(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isExpanded, shrinkOnScroll]);

  if (isExpanded) {
    return (
      <header
        className={`header-expanded fixed inset-x-0 top-0 z-10 border-b border-orange-300/85 bg-cover bg-center bg-no-repeat backdrop-blur-md transition-all duration-300 ${
          isCompact ? "bg-orange-200/92" : ""
        }`}
      >
        {backgroundImage ? (
          <div className="pointer-events-none absolute inset-0 -z-10">
            <Image
              src={backgroundImage}
              alt=""
              fill
              priority
              aria-hidden="true"
              className="object-cover object-center"
            />
          </div>
        ) : null}

        <div
          className={`w-full transition-all duration-300 ${
            isCompact ? "bg-black/55" : "h-80 bg-black/40"
          }`}
        >
          <div
            className={`mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-10 ${
              isCompact ? "py-3" : "h-full"
            }`}
          >
            <div>
              <h1
                className={`font-extrabold tracking-wide text-blue-500 drop-shadow-sm transition-all duration-300 ${
                  isCompact ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
                }`}
              >
                Pixel or Paper
              </h1>
              <p
                className={`font-semibold tracking-[0.08em] text-blue-200 drop-shadow-sm transition-all duration-300 ${
                  isCompact
                    ? "mt-1 text-xs sm:text-sm"
                    : "mt-2 text-sm sm:text-base"
                }`}
              >
                Collect gallery-quality images and fine art prints.
              </p>
            </div>

            <button
              onClick={onCartClick}
              className={`rounded-full border border-white font-semibold text-white tracking-wide transition hover:-translate-y-0.5 hover:bg-white hover:text-zinc-900 ${
                isCompact
                  ? "px-3 py-1.5 text-xs sm:text-sm"
                  : "px-4 py-2 text-sm"
              }`}
              type="button"
            >
              Cart ({itemCount})
            </button>
          </div>
        </div>
      </header>
    );
  }

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
