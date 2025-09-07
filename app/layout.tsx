import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Veridic AI - Your AI-Powered Legal Compliance Partner",
  description:
    "Navigate company law, corporate governance, and compliance with AI you can trust. Get instant, accurate legal guidance tailored to your business.",
  keywords:
    "legal AI, compliance, corporate law, legal technology, AI legal assistant",
  authors: [{ name: "Veridic AI" }],
  openGraph: {
    title: "Veridic AI - Your AI-Powered Legal Compliance Partner",
    description:
      "Navigate company law, corporate governance, and compliance with AI you can trust.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veridic AI - Your AI-Powered Legal Compliance Partner",
    description:
      "Navigate company law, corporate governance, and compliance with AI you can trust.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
