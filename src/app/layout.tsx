import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Mono } from "next/font/google";
import { ThemeProvider, themeInitScript } from "@/components/theme/theme-provider";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const sans = Bricolage_Grotesque({
  variable: "--font-sans-face",
  subsets: ["latin"],
});

const mono = DM_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500"],
});


const title = "Abhishek Kokadwar — Software Engineer";
const description =
  "Building AI systems, backend infrastructure, and security tooling. Integrated dual degree (IT) student at IIIT Gwalior.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s — Abhishek Kokadwar",
  },
  description,
  keywords: [
    "Abhishek Kokadwar",
    "Software Engineer",
    "AI systems",
    "backend",
    "security",
    "IIITM Gwalior",
  ],
  authors: [{ name: "Abhishek Kokadwar" }],
  creator: "Abhishek Kokadwar",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Abhishek Kokadwar",
    title,
    description,
    // opengraph-image.tsx is picked up automatically by Next.
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffe45c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
