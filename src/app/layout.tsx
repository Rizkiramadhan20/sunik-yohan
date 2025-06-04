import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "@/base/style/globals.css";

import Providers from "@/base/routing/Provider";

import Pathname from "@/base/routing/Pathname";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sunik Yohan",
  description: "Temukan kesegaran minuman boba terbaik hanya di Sunik Yohan! Dengan varian rasa yang menggoda dan topping melimpah, rasakan sensasi manis yang tak terlupakan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Pathname>
            {children}
          </Pathname>
        </Providers>
      </body>
    </html>
  );
}
