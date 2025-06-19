import type { Metadata } from "next";
import RootProvider from "@/providers/providers";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "eCastle",
  description: "Amdin - eCastle",
};


export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${inter.variable}`}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <RootProvider session={session}>{children}</RootProvider>
        </div>
      </body>
    </html>
  );
}
