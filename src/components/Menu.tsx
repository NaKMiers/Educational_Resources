'use client'

import { getSession, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface MenuProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

function Menu({ open, setOpen, className = '' }: MenuProps) {
  // hooks
  const { data: session } = useSession()

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
          open ? 'block' : 'hidden'
        } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30 ${className}`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Main */}
      <ul
        className={`${
          open
            ? 'max-h-[400px] sm:max-w-full sm:w-[300px] sm:max-h-[350px] p-3 opacity-1x'
            : 'max-h-0 sm:max-h-0 p-0 sm:max-w-0 sm:w-0 opacity-0x'
        } ${
          curUser && !curUser?._id ? 'hidden' : ''
        } text-dark w-full overflow-hidden trans-300 absolute bottom-[72px] md:bottom-auto md:top-[60px] right-0 sm:right-21 z-30 sm:rounded-medium sm:shadow-sky-400 shadow-md bg-slate-100`}>
        {curUser ? (
          // MARK: User Logged In
          curUser?._id && (
            <>
              <Link
                href={`/user/${curUser?._id}`}
                className='flex items-center gap-2 py-2 px-3 rounded-lg group hover:bg-white trans-200'>
                <Image
                  className='aspect-square rounded-full wiggle-0'
                  src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                  height={40}
                  width={40}
                  alt='avatar'
                />
                <div className='flex flex-col'>
                  <p className='font-semibold text-2xl leading-6 mb-1'>
                    {curUser?.firstName && curUser?.lastName
                      ? `${curUser.firstName} ${curUser.lastName}`
                      : curUser.username}
                  </p>
                  <p className='text-xs '>{curUser.email}</p>
                </div>
              </Link>

              <li className='group' onClick={() => setOpen(false)}>
                <Link
                  href={`/user/${curUser?._id}`}
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white trans-200'>
                  <Image src='/images/info-icon.png' width={32} height={32} alt='icon' />
                  <span className='font-body text-xl font-semibold tracking-wide'>Profile</span>
                </Link>
              </li>
              <li className='group' onClick={() => setOpen(false)}>
                <Link
                  href={`/my-courses`}
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white trans-200'>
                  <Image src='/images/my-courses-icon.png' width={32} height={32} alt='icon' />
                  <span className='font-body text-xl font-semibold tracking-wide'>My Courses</span>
                </Link>
              </li>
              <li className='group' onClick={() => setOpen(false)}>
                <Link
                  href='/setting'
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white trans-200'>
                  <Image src='/images/setting-icon.png' width={32} height={32} alt='icon' />
                  <span className='font-body text-xl font-semibold tracking-wide'>Setting</span>
                </Link>
              </li>
              {curUser?.role !== 'user' && (
                <li className='group' onClick={() => setOpen(false)}>
                  <Link
                    href={
                      ['admin', 'editor'].includes(curUser?.role)
                        ? '/admin/order/all'
                        : '/admin/summary/all'
                    }
                    className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white trans-200'>
                    <Image src='/images/order-icon.png' width={32} height={32} alt='icon' />
                    <span className='font-body text-xl font-semibold tracking-wide'>
                      {['admin', 'editor'].includes(curUser?.role) ? 'Orders' : 'Collaborator'}
                    </span>
                  </Link>
                </li>
              )}
              <li className='group' onClick={() => setOpen(false)}>
                <button
                  className='flex items-center w-full gap-2 py-2 px-3 rounded-lg hover:bg-white trans-200'
                  onClick={() => signOut()}>
                  <Image src='/images/logout-icon.png' width={32} height={32} alt='icon' />
                  <span className='font-body text-xl font-semibold tracking-wide'>Logout</span>
                </button>
              </li>
            </>
          )
        ) : (
          // MARK: User Not Logged In
          <>
            <li className='group' onClick={() => setOpen(false)}>
              <Link
                href='/auth/login'
                className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white trans-200'>
                <Image src='/images/sign-in-icon.png' width={32} height={32} alt='icon' />
                <span className='font-body text-xl font-semibold tracking-wide'>Sign In</span>
              </Link>
            </li>
            <li className='group' onClick={() => setOpen(false)}>
              <Link
                href='/auth/register'
                className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white trans-200'>
                <Image src='/images/sign-up-icon.png' width={32} height={32} alt='icon' />
                <span className='font-body text-xl font-semibold tracking-wide'>Sign Up</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </>
  )
}

export default Menu
