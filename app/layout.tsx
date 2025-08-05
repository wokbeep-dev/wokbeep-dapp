import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wokbeep dApp',
  description: 'Created with nextjs',
  generator: 'bravolakmedia',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
