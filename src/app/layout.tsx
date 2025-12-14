import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FarmCaster",
  description: "Plant seeds, harvest rewards on chain! 🚜",
  openGraph: {
    title: "FarmCaster",
    description: "Plant seeds, harvest rewards on chain! 🚜",
    url: "https://farmcaster-six.vercel.app",
    siteName: "FarmCaster",
    images: [
      {
        url: "https://farmcaster-six.vercel.app/images/cover.png", // MUST be absolute
        width: 1200,
        height: 630,
        alt: "FarmCaster Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  other: {
    'base:app_id': '693df866d77c069a945bde9a',
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://farmcaster-six.vercel.app/images/cover.png",
      button: {
        title: "Open FarmCaster",
        action: {
          type: "launch_frame",
          name: "FarmCaster",
          url: "https://farmcaster-six.vercel.app",
          splashImageUrl: "https://farmcaster-six.vercel.app/images/icon.png",
          splashBackgroundColor: "#0f172a",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
