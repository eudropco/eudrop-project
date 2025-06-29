import './globals.css'
import Providers from './components/Providers' // Yeni bileşenimizi import ediyoruz

export const metadata = {
  title: 'EuDrop',
  description: 'Welcome to EuDrop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Tüm sayfalarımızı bu sağlayıcı ile sarmalıyoruz */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}