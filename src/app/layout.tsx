import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-family",
});

export const metadata: Metadata = {
  title: "Cosmuv",
  description: "Your professional storefront powered by Cosmuv",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${poppins.variable} ${poppins.className} min-h-full flex flex-col bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
