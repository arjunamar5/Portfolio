import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/caveat";
import "@fontsource-variable/unbounded";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070a12",
};

export const metadata: Metadata = {
  title: "Arjun R Amarnath",
  description:
    "Portfolio of Arjun R Amarnath — a Computer Science graduate and full-stack & AI/ML developer building LLM-powered applications, RAG systems, and production web platforms.",
  keywords: [
    "Arjun R Amarnath",
    "Full-Stack Developer",
    "AI/ML Developer",
    "LLM",
    "RAG",
    "React.js",
    "AWS",
    "Software Engineer Portfolio",
  ],
  authors: [{ name: "Arjun R Amarnath" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-void text-bone antialiased font-sans">
        <SmoothScroll>
          <div className="grain-overlay" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
