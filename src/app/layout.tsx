export { metadata };

import { metadata } from "@/base/meta/Metadata";

metadata.manifest = "/manifest.json";

import Providers from "@/base/routing/Provider";

import Pathname from "@/base/routing/Pathname";

import { poppins, spaceGrotesk } from "@/base/fonts/Fonts";

import "@/base/style/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_ID as string} />
      </head>
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
