'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className='bg-black flex justify-center items-center h-screen w-screen'>
      <button
        className='px-5 py-3 bg-white text-dark rounded-lg shadow-lg'
        onClick={() => {
          signOut()
          router.push('/auth/login')
        }}>
        Log Out
      </button>
    </div>
  )
}
