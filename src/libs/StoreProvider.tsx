'use client'

import { SessionProvider } from 'next-auth/react'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { AppStore, makeStore } from './store'

function StoreProvider({ children, session }: { children: React.ReactNode; session: any }) {
  const storeRef = useRef<AppStore>()

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </Provider>
  )
}

export default StoreProvider
