import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

export function resolveR2Config(): { bucket: string; endpoint: string } | null {
  const explicitEndpoint = process.env.R2_S3_ENDPOINT;
  const accountId = process.env.R2_ACCOUNT_ID;

  if (explicitEndpoint) {
    try {
      const parsed = new URL(explicitEndpoint);
      const bucketFromPath = parsed.pathname.split("/").filter(Boolean)[0];
      const endpoint = `${parsed.protocol}//${parsed.host}`;
      const bucket = process.env.R2_BUCKET_NAME ?? bucketFromPath;

      if (!bucket) {
        return null;
      }

      return { bucket, endpoint };
    } catch {
      return null;
    }
  }

  if (!accountId) {
    return null;
  }

  return {
    bucket: process.env.R2_BUCKET_NAME ?? "base44-images",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  };
}

export function createR2Client(): S3Client | null {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const resolved = resolveR2Config();

  if (!resolved || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: resolved.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}
