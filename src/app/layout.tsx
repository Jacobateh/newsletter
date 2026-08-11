import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hausa Arabia Newsletter",
    template: "%s | Hausa Arabia",
  },
  description:
    "Join the Hausa Arabia community and receive useful Hausa and Arabic lessons, vocabulary, pronunciation tips, learning challenges, and important updates directly in your inbox.",
  icons: {
    icon: "/hausa-arabia-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-hero min-h-screen font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
