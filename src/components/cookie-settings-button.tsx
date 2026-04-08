"use client";

import { COOKIE_SETTINGS_EVENT } from "@/lib/cookie-consent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
      className="text-xs uppercase tracking-[0.12em] text-zinc-700 underline-offset-2 transition hover:text-zinc-900 hover:underline"
    >
      Cookie settings
    </button>
  );
}
