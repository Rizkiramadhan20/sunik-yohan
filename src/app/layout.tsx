import { metadata } from "@/base/meta/Metadata";

import Providers from "@/base/routing/Provider";

import Pathname from "@/base/routing/Pathname";

import { poppins, spaceGrotesk } from "@/base/fonts/Fonts";

import "@/base/style/globals.css";

metadata.manifest = "/manifest.json";

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
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
