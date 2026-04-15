import { NextRequest, NextResponse } from "next/server";

const backendBaseUrl = process.env.BACKEND_API_URL;

async function proxyToBackend(request: NextRequest, route: string[]) {
  if (!backendBaseUrl) {
    return NextResponse.json(
      { message: "BACKEND_API_URL is not configured." },
      { status: 500 },
    );
  }

  const normalizedBase = backendBaseUrl.endsWith("/")
    ? backendBaseUrl.slice(0, -1)
    : backendBaseUrl;
  const path = route.join("/");
  const targetUrl = new URL(`${normalizedBase}/${path}`);

  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
  });

  const body = await response.arrayBuffer();
  const headers = new Headers(response.headers);

  headers.delete("content-encoding");
  headers.delete("content-length");

  return new NextResponse(body, {
    status: response.status,
    headers,
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ route: string[] }> }) {
  const { route } = await context.params;
  return proxyToBackend(request, route);
}

export async function POST(request: NextRequest, context: { params: Promise<{ route: string[] }> }) {
  const { route } = await context.params;
  return proxyToBackend(request, route);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ route: string[] }> }) {
  const { route } = await context.params;
  return proxyToBackend(request, route);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ route: string[] }> }) {
  const { route } = await context.params;
  return proxyToBackend(request, route);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ route: string[] }> }) {
  const { route } = await context.params;
  return proxyToBackend(request, route);
}
