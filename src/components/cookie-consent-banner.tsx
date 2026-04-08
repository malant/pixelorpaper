"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_SETTINGS_EVENT,
  type CookieConsentChoice,
} from "@/lib/cookie-consent";

function readStoredChoice(): CookieConsentChoice | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  return stored === "accepted" || stored === "rejected" ? stored : null;
}

export function CookieConsentBanner() {
  const [choice, setChoice] = useState<CookieConsentChoice | null>(() =>
    readStoredChoice(),
  );
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const onSettingsOpen = () => {
      setShowPreferences(true);
    };

    window.addEventListener(COOKIE_SETTINGS_EVENT, onSettingsOpen);
    return () => {
      window.removeEventListener(COOKIE_SETTINGS_EVENT, onSettingsOpen);
    };
  }, []);

  const saveChoice = (nextChoice: CookieConsentChoice) => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, nextChoice);
    setChoice(nextChoice);
    setShowPreferences(false);
    window.dispatchEvent(
      new CustomEvent(COOKIE_CONSENT_CHANGED_EVENT, {
        detail: { choice: nextChoice },
      }),
    );
  };

  const isOpen = showPreferences || choice === null;

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-zinc-300 bg-white/95 p-4 shadow-xl backdrop-blur-sm md:left-auto md:w-[26rem]">
      <p className="mb-2 text-sm font-semibold text-zinc-900">
        Cookie preferences
      </p>
      <p className="mb-4 text-xs leading-relaxed text-zinc-700">
        We use analytics cookies to understand site performance and improve the
        shopping experience. You can update this choice anytime from Cookie
        settings in the footer.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => saveChoice("accepted")}
          className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-orange-50 transition hover:bg-zinc-700"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => saveChoice("rejected")}
          className="rounded-full border border-zinc-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-800 transition hover:bg-zinc-100"
        >
          Reject analytics
        </button>
      </div>
      {choice ? (
        <p className="mt-3 text-[11px] text-zinc-600">Saved: {choice}</p>
      ) : null}
    </aside>
  );
}
