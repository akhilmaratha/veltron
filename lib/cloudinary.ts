import { createHash, createHmac } from "node:crypto";

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

export function verifyRazorpayWebhookSignature(
  payload: string,
  signature: string,
  webhookSecret: string,
): boolean {
  const expectedSignature = createHmac("sha256", webhookSecret).update(payload).digest("hex");
  return signature === expectedSignature;
}