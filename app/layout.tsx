import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import ThemesProviders from "@/components/themesproviders";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const generalSansFallback = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ĒLAN Fashion Rec | Modern African Fashion Marketplace",
  description:
    "Adúnní blends Nigerian traditional wear with modern streetwear for a bold, style-first generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${generalSansFallback.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-base text-cloud font-body">
        <ThemesProviders>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
              },
            }}
          />
        </ThemesProviders>
      </body>
    </html>
  );
}
