import { NextResponse } from "next/server";
import { z } from "zod";
import { createCloudinarySignature } from "@/lib/cloudinary";

const requestSchema = z.object({
  folder: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { message: "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET." },
      { status: 500 },
    );
  }

  try {
    const json = await request.json().catch(() => ({}));
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid request payload." },
        { status: 400 },
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = parsed.data.folder ?? process.env.CLOUDINARY_UPLOAD_FOLDER ?? "veltron/products";
    const signature = createCloudinarySignature({ timestamp, folder }, apiSecret);

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
    });
  } catch {
    return NextResponse.json({ message: "Unable to generate upload signature." }, { status: 500 });
  }
}