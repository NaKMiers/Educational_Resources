import AllLessons from '@/components/AllLessons'
import Header from '@/components/Header'
import StoreProvider from '@/libs/StoreProvider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Toaster } from 'react-hot-toast'
import '../globals.scss'
import PageLoading from '@/components/PageLoading'

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

          {/* Heading */}
          <Header />

          {/* Page Loading */}
          <PageLoading />

          {/* Main */}
          <main className='flex mb-[72px] md:mb-auto md:mt-[72px] gap-y-4'>
            <AllLessons />

            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  )
}
