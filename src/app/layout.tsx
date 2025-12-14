import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// DEFINE METADATA FOR SOCIAL PREVIEWS
export const metadata: Metadata = {
  title: "FarmCaster",
  description: "The most vibrant onchain farming game. Plant seeds, earn XP, and climb the leaderboard.",
  metadataBase: new URL("https://farmcaster-six.vercel.app"),
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
