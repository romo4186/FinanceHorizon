import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SchemaData from '@/components/SchemaData';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.financehorizon.com'),
  title: {
    default: 'Finance Horizon | Navigate Your Financial Future',
    template: '%s | Finance Horizon'
  },
  description: 'Expert guides on credit cards, high yield savings accounts, investing basics, and insurance comparison. Empowering you to make smarter financial decisions.',
  keywords: [
    'personal finance',
    'credit cards',
    'high yield savings',
    'investing for beginners',
    'auto insurance quotes',
    'retirement planning',
    'Roth IRA',
    'FDIC insurance',
    'financial literacy'
  ],
  authors: [{ name: 'Finance Horizon Editorial Team' }],
  creator: 'Finance Horizon',
  publisher: 'Finance Horizon',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Finance Horizon | Navigate Your Financial Future',
    description: 'Expert guides on credit cards, high yield savings accounts, investing basics, and insurance comparison. Empowering you to make smarter financial decisions.',
    url: 'https://www.financehorizon.com',
    siteName: 'Finance Horizon',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Finance Horizon - Navigate Your Financial Future',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finance Horizon | Navigate Your Financial Future',
    description: 'Expert guides on credit cards, banking, investing, and insurance.',
    images: ['/images/og-default.jpg'],
    creator: '@financehorizon',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Header />
        <main style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
        <SchemaData type="organization" />
      </body>
    </html>
  );
}
