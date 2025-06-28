import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EuDrop',
  description: 'Welcome to EuDrop',
}

// Değişiklik burada: Fonksiyona gelen 'children' props'unun tipini belirtiyoruz.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}