import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_TWITTER_HANDLE,
} from "@/lib/site-meta";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const socialTitle = `${SITE_NAME} - ${SITE_TAGLINE}`;

export const metadata: Metadata = {
  // Resolves relative Open Graph and canonical URLs against the real domain
  // in production instead of falling back to localhost.
  metadataBase: new URL(getSiteUrl()),

  // Deliberately a plain string rather than a { default, template } pair:
  // every page sets its own full "... | Sevlab" title, so a template would
  // render the suffix twice.
  title: socialTitle,
  description: SITE_DESCRIPTION,
  keywords: [
    "build in public",
    "indie hackers",
    "side projects",
    "developer community",
    "find a technical co-founder",
    "find collaborators",
    "creator partnerships",
    "get unstuck",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: socialTitle,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: SITE_DESCRIPTION,
    site: SITE_TWITTER_HANDLE,
    creator: SITE_TWITTER_HANDLE,
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="font-[var(--font-body)] text-[15px] antialiased">
        {children}
      </body>
    </html>
  );
}
