import type { Metadata } from "next";

import "@/base/style/globals.css";

import Providers from "@/base/routing/Provider";

import Pathname from "@/base/routing/Pathname";

import { poppins, spaceGrotesk } from "@/base/fonts/Fonts";

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
        className={`${poppins.variable} ${spaceGrotesk.variable} antialiased`}
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
