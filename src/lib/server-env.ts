import "server-only";

import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

function clean(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getServerEnv(name: string): string | undefined {
  const fromProcess = clean(process.env[name]);
  if (fromProcess) {
    return fromProcess;
  }

  let context: ReturnType<typeof getOptionalRequestContext> | undefined;

  try {
    context = getOptionalRequestContext();
  } catch {
    return undefined;
  }

  if (!context) {
    return undefined;
  }

  const envRecord = context.env as Record<string, unknown>;
  return clean(envRecord[name]);
}
