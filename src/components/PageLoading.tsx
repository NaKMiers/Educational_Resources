'use client'

import { useAppSelector } from '@/libs/hooks'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

function PageLoading() {
  // hooks
  const isPageLoading = useAppSelector(state => state.modal.isPageLoading)

  return (
    <div
      className={`${
        isPageLoading ? 'flex' : 'hidden'
      } items-center justify-center fixed z-50 w-screen h-screen top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30`}>
      <div className='relative flex justify-center items-center'>
        <AiOutlineLoading3Quarters size={48} className='text-white animate-spin' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white w-8 h-8 animate-pulse' />
      </div>
    </div>
  )
}

export default PageLoading
