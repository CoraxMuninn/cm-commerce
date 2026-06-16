import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from "@/lib/constants/index";
import Provider from "@/app/Provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SERVER_URL),

  title: {
    template: `%s | CM Store`,
    default: APP_NAME,
  },

  description: APP_DESCRIPTION,

  openGraph: {
    title: APP_NAME,
    description: "Discover modern fashion and premium street wear at CM Store.",
    url: SERVER_URL,
    siteName: APP_NAME,

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CM Store",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: "Discover modern fashion and premium street wear at CM Store.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <Provider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
