import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-kalyuugh",
});

export const metadata: Metadata = {
  title: "Kalyuugh",
  description: "Oracle of Kalyuugh – Karma & Paap Guidance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-kalyuugh antialiased`}>
        {children}
      </body>
    </html>
  );
}
