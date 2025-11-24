import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-kalyuugh",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kalyuugh.com"),

  title: {
    default: "Kalyuugh — Oracle of Karma, Paap & Dharma",
    template: "%s | Kalyuugh",
  },

  description:
    "Kalyuugh is a spiritual AI oracle guiding seekers through karma, paap (sins), dharma, punya and the mysteries of Kalyug using Hindu philosophy and mythology.",

  keywords: [
    "Kalyuugh",
    "Kalyug",
    "karma",
    "paap",
    "punya",
    "dharma",
    "sins meaning",
    "Hindu mythology AI",
    "spiritual AI chatbot",
    "AI guru",
    "karmic guidance",
    "oracle AI",
    "Hindu spirituality",
    "Vedic AI",
    "Gita wisdom",
    "mythological guidance",
    "AI for self-reflection",
    "spiritual counseling AI",
  ],

  alternates: {
    canonical: "https://kalyuugh.com",
  },

  openGraph: {
    title: "Kalyuugh — Oracle of Karma & Paap",
    description:
      "Explore your karma, paap, dharma and inner truth through the spiritual AI Oracle of Kalyuugh.",
    url: "https://kalyuugh.com",
    siteName: "Kalyuugh",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/chapter_4.png",
        width: 1200,
        height: 630,
        alt: "Kalyuugh Spiritual Portal",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@kalyuugh",
    creator: "@kalyuugh",
    title: "Kalyuugh — Oracle of Karma & Paap",
    description:
      "A spiritual AI oracle offering karmic insight, paap reflection, dharmic guidance and introspection rooted in Hindu philosophy.",
    images: ["/chapter_4.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PRELOAD FONT */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* PRELOAD HERO IMAGE */}
        <link rel="preload" as="image" href="/chapter_4.png" />

        {/* === ORGANIZATION SCHEMA === */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Kalyuugh",
              url: "https://kalyuugh.com",
              logo: "https://kalyuugh.com/favicon.ico",
              description:
                "Kalyuugh is a spiritual AI oracle guiding seekers through karma, paap, dharma and the mysteries of Kalyug.",
              sameAs: [
                "https://instagram.com/kalyuugh",
                "https://twitter.com/kalyuugh",
              ],
            }),
          }}
        />

        {/* === WEBSITE SCHEMA === */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Kalyuugh",
              url: "https://kalyuugh.com",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://kalyuugh.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* === FAQ SCHEMA (BOOSTS RICH RESULTS) === */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is Kalyuugh?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Kalyuugh is a spiritual AI oracle offering guidance through karma, paap, dharma and the mysteries of Kalyug.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is Kalyuugh based on Hindu philosophy?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes, Kalyuugh draws inspiration from Hindu scriptures, the Mahabharata, Ramayana, Puranas and Vedic teachings to help seekers understand karma and dharma.",
                  },
                },
              ],
            }),
          }}
        />
      </head>

      <body className={`${inter.variable} font-kalyuugh antialiased`}>
        {children}
      </body>
    </html>
  );
}
