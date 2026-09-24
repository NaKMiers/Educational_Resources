'use client'

import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from './store'

function StoreProvider({ children, session }: { children: React.ReactNode; session: any }) {
  const [store] = useState(makeStore)

  return (
    <Provider store={store}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </Provider>
  )
}

export default StoreProvider
