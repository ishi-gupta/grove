import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Grove',
  description: 'A time capsule for yourself.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
