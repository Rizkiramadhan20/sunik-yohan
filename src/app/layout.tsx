import { metadata } from "@/base/meta/Metadata";

metadata.manifest = "/manifest.json";

import Providers from "@/base/routing/Provider";

import Pathname from "@/base/routing/Pathname";

import { poppins, spaceGrotesk } from "@/base/fonts/Fonts";

import "@/base/style/globals.css";

import { GoogleTagManager, GoogleTagManagerNoScript } from '@/base/analytics/GoogleTagManager'

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <GoogleTagManager />
      </head>
      <body
        className={`${poppins.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <GoogleTagManagerNoScript />
        <Providers>
          <Pathname>
            {children}
          </Pathname>
        </Providers>
      </body>
    </html>
  );
}
