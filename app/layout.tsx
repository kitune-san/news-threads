import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/app/components/header'
import Footer from '@/app/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.APP_NAME,
  description: process.env.APP_DESCRIPTION,
  openGraph: {
    title: process.env.OPENGRAPH_TITLE,
    description: process.env.OPENGRAPH_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <div className='flex flex-col w-full h-full min-h-screen'>
          <Header />
          <main className='flex flex-col  flex-grow pr-10 pl-10'>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
