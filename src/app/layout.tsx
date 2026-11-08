import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Playfair_Display, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import JsonLd from "@/components/shared/JsonLd";
import { organizationLd } from "@/lib/seo";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair", display: "swap" });
// Typeface of the original Creative experience; not preloaded so Business pages don't pay for it.
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap", preload: false });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Kllezo — Two ways to experience growth",
  description: site.description,
  applicationName: "Kllezo",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kllezo — Two ways to experience growth",
    description: site.tagline,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${playfair.variable} ${mono.variable} ${cormorant.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
        <JsonLd data={organizationLd()} />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
