import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Header from "@/app/components/header"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App name",
  description: "App description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex flex-col w-full h-full min-h-screen">
          <Header />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
