import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "Sevlab",
    template: "%s | Sevlab",
  },
  description: "A mobile-first community platform for African self-taught developers to share projects, get unstuck, and find collaborators.",
  keywords: ["African developers", "self-taught programmers", "tech community Africa", "project sharing", "developer collaboration"],
  authors: [{ name: "Sevlab" }],
  openGraph: {
    title: "Sevlab - Build. Share. Get Help.",
    description: "A focused space for African builders to show what they are creating, ask for help when blocked, and find people to collaborate with.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sevlab - Build. Share. Get Help.",
    description: "A mobile-first community platform for African developers.",
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
