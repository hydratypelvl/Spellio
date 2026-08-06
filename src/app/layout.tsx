import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spellio",
  description: "A Wordle-inspired word guessing game",
  openGraph: {
    title: "Spellio",
    description: "Guess the word in 6 tries",
    url: "https://spellio-omega.vercel.app",
    siteName: "Spellio",
    images: [
      {
        url: "https://spellio-omega.vercel.app/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Spellio - Word Guessing Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spellio",
    description: "Guess the word in 6 tries",
    images: ["https://spellio-omega.vercel.app/og-image.svg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
