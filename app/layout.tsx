import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  title: 'DEEN Care Global Foundation',
  description: 'Direct financial assistance and practical support for people who genuinely need it, anywhere in the world.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'DEEN Care Global Foundation',
    description: 'Direct financial assistance and practical support for people who genuinely need it, anywhere in the world.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'DEEN Care Global Foundation' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
