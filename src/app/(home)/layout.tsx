import Header from '@/components/Header'
import StoreProvider from '@/libs/StoreProvider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Toaster } from 'react-hot-toast'
import '../globals.scss'
import Footer from '@/components/Footer'
import PageLoading from '@/components/PageLoading'
import FloatingButton from '@/components/FloatingButton'

export const metadata: Metadata = {
  title: 'Educational Resources',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()

  return (
    <html lang='vi'>
      <body className='' suppressHydrationWarning={true}>
        <StoreProvider session={session}>
          {/* Toast */}
          <Toaster
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />

          {/* Header */}
          <Header />

          {/* Loading */}
          <PageLoading />

          {/* Floating Button */}
          <FloatingButton />

          {/* Main */}
          <main className='mb-[72px] md:mb-auto md:mt-[72px]'>{children}</main>

          {/* Footer */}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  )
}
