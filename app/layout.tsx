import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const headingFont = Playfair_Display({
  variable: "--font-heading-custom",
  subsets: ["latin"],
});

const bodyFont = Inter({
  variable: "--font-body-custom",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veltron",
  description: "Premium electronics e-commerce experiences for Veltron.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-body text-text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
