import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Muke Deals | Premium Auto Inventory',
  description: 'Find your perfect vehicle with Muke Deals premium auto inventory and concierge service.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-light text-slate-900`}>{children}</body>
    </html>
  );
}
