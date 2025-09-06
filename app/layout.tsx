import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Universal Sports Calendar - Any Team, Any Sport',
    template: '%s | Universal Sports Calendar'
  },
  description: 'Subscribe to any sports team schedule from any league worldwide. Get NBA, NFL, MLB, NHL, college football schedules. Compatible with Apple Calendar, Google Calendar, Outlook. Free sports calendar subscriptions.',
  keywords: [
    'sports calendar',
    'team schedule',
    'NBA schedule',
    'NFL schedule', 
    'MLB schedule',
    'NHL schedule',
    'college football schedule',
    'Miami Heat schedule',
    'Miami Dolphins schedule',
    'Miami Hurricanes schedule',
    'calendar subscription',
    'sports calendar app',
    'team calendar',
    'free sports calendar',
    'Apple Calendar',
    'Google Calendar',
    'Outlook calendar',
    'sports schedule download',
    'team schedule subscription',
    'sports calendar ics'
  ],
  authors: [{ name: 'Universal Sports Calendar' }],
  creator: 'Universal Sports Calendar',
  publisher: 'Universal Sports Calendar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://team-schedule-sub.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Universal Sports Calendar - Any Team, Any Sport',
    description: 'Subscribe to any sports team schedule from any league worldwide. Get NBA, NFL, MLB, NHL, college football schedules. Compatible with Apple Calendar, Google Calendar, Outlook.',
    url: 'https://team-schedule-sub.vercel.app',
    siteName: 'Universal Sports Calendar',
    images: [
      {
        url: 'https://team-schedule-sub.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Universal Sports Calendar - Subscribe to any team schedule',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universal Sports Calendar - Any Team, Any Sport',
    description: 'Subscribe to any sports team schedule from any league worldwide. Compatible with Apple Calendar, Google Calendar, and more.',
    images: ['https://team-schedule-sub.vercel.app/og-image.png'],
    creator: '@universalsportscal',
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
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}