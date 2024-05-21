'use client'

import { notificationSamples } from '@/constants/dataSamples'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { format } from 'timeago.js'

interface NotificationMenuProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  className?: string
}

function NotificationMenu({ open, setOpen, className = '' }: NotificationMenuProps) {
  // hooks
  const { data: session } = useSession()

  // states
  const [curUser, setCurUser] = useState<any>(session?.user || {})
  console.log('curUser:', curUser)

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
          open ? 'block' : 'hidden'
        } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30 ${className}`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Main */}
      <ul
        className={`${
          open
            ? 'max-h-[400px] sm:max-w-full sm:w-[300px] sm:max-h-[350px] p-2 opacity-1x'
            : 'max-h-0 sm:max-h-0 p-0 sm:max-w-0 sm:w-0 opacity-0x'
        } ${
          curUser && !curUser?._id ? 'hidden' : ''
        } flex flex-col gap-2 overflow-y-auto w-full overflow-hidden transition-all duration-300 absolute bottom-[72px] md:bottom-auto md:top-[60px] right-0 sm:right-21 z-30 sm:rounded-medium sm:shadow-sky-400 shadow-md bg-slate-100`}>
        {notificationSamples.map((notification, index) => {
          const { user, title, content, createdAt } = JSON.parse(notification)
          console.log('notify:', user)

          return (
            <li className='bg-red-100 rounded-lg hover:bg-white trans-300 p-2' key={index}>
              <div className='flex gap-2 mb-2'>
                <Link
                  href='/user/'
                  className='max-w-[28px] max-h-[28px] w-full h-full rounded-full shadow-lg overflow-hidden'>
                  <Image
                    className='w-full h-full object-cover'
                    src={user.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                    width={28}
                    height={28}
                    alt='avatar'
                  />
                </Link>
                <div className='font-body tracking-wider -mt-1'>
                  <p className='font-semibold text-xs'>{title}</p>
                  <p className='text-xs'>{format(createdAt)}</p>
                </div>
              </div>
              <p className='font-body text-xs tracking-wider'>{content}</p>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default NotificationMenu
