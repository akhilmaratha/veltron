import { createHash } from "node:crypto";

interface CloudinarySignParams {
  timestamp: number;
  folder?: string;
}

export function createCloudinarySignature(params: CloudinarySignParams, apiSecret: string): string {
  const payloadParts = [`timestamp=${params.timestamp}`];

  if (params.folder) {
    payloadParts.push(`folder=${params.folder}`);
  }

  const payload = payloadParts.join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}