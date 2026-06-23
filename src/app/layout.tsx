import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-family",
});

export const metadata: Metadata = {
  title: "Yu Turmeric",
  description: "Enhanced Bioactive Turmeric",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${poppins.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
