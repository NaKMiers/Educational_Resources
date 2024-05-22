'use client'

import { INotification } from '@/models/UserModel'
import { removeNotificationApi } from '@/requests'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { format } from 'timeago.js'

interface NotificationMenuProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  notifications: INotification[]
  handleRemoveNotification: (id: string) => void
  className?: string
}

function NotificationMenu({
  open,
  setOpen,
  notifications,
  handleRemoveNotification,
  className = '',
}: NotificationMenuProps) {
  // hooks
  const { data: session } = useSession()
  const router = useRouter()

  // states
  const [curUser, setCurUser] = useState<any>(session?.user || {})
  // update user session
  useEffect(() => {
    const getUser = async () => {
      const session = await getSession()
      setCurUser(session?.user)
    }

    if (!curUser?._id) {
      getUser()
    }
  }, [curUser])

  // key board event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // clean up
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen])

  return (
    <>
      {/* MARK: Overlay */}
      <div
        className={`${
          open && notifications.length ? 'block' : 'hidden'
        } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30 ${className}`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Main */}
      <ul
        className={`${
          open && notifications.length
            ? 'max-h-[400px] sm:max-w-full sm:w-[300px] sm:max-h-[350px] p-2 opacity-1x'
            : 'max-h-0 sm:max-h-0 p-0 sm:max-w-0 sm:w-0 opacity-0x'
        } ${
          curUser && !curUser?._id ? 'hidden' : ''
        } flex flex-col gap-2 overflow-y-auto w-full overflow-hidden trans-300 absolute bottom-[72px] md:bottom-auto md:top-[60px] right-0 sm:right-21 z-30 sm:rounded-medium sm:shadow-sky-400 shadow-md bg-slate-100`}>
        {notifications.map((noti: INotification) => (
          <li className='relative bg-red-100 rounded-lg hover:bg-white trans-300 p-2' key={noti._id}>
            <div
              className={`flex gap-2 ${noti.link ? 'cursor-pointer' : ''}`}
              onClick={() => noti.link && router.push(noti.link)}>
              <div className='max-w-[28px] max-h-[28px] w-full h-full rounded-md shadow-lg overflow-hidden'>
                <Image
                  className='w-full h-full object-cover'
                  src={noti.image}
                  width={28}
                  height={28}
                  alt='avatar'
                />
              </div>
              <div className='font-body tracking-wider -mt-1 w-full'>
                <p className='flex justify-between gap-2 font-semibold text-xs'>
                  {noti.title}
                  <IoCloseCircleOutline
                    size={20}
                    className='wiggle-1 flex-shrink-0'
                    onClick={e => {
                      e.stopPropagation()
                      handleRemoveNotification(noti._id)
                    }}
                  />
                </p>
                <p className='text-xs'>{format(noti.createdAt)}</p>
              </div>
            </div>
            {noti.content && <p className='font-body text-xs tracking-wider mt-2'>{noti.content}</p>}
          </li>
        ))}
      </ul>
    </>
  )
}

export default NotificationMenu
