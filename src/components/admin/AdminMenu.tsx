'use client'

import { adminLinks } from '@/constants'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FaBarsStaggered } from 'react-icons/fa6'

function AdminMenu() {
  // hooks
  const { data: session } = useSession()

  // states
  const [curUser, setCurUser] = useState<any>(session?.user || {})
  const [open, setOpen] = useState<boolean>(false)

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
  }, [])

  return (
    <>
      {/* MARK: Overlay */}
      <div
        className={`${
          open ? 'block' : 'hidden'
        } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Open Button */}
      <button
        className={`fixed top-[15%] z-20 right-0 p-[5px] pl-2 bg-dark-100 text-white rounded-tl-md rounded-bl-md shadow-md trans-200 hover:bg-primary ${
          !open ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={() => setOpen(!open)}>
        <FaBarsStaggered size={20} />
      </button>

      {/* MARK: Main */}
      <div
        className={`fixed top-[15%] max-h-[600px] overflow-auto z-${
          open ? 30 : 20
        } right-0 p-4 bg-dark-100 text-white rounded-tl-medium rounded-bl-medium shadow-primary shadow-md max-w-[300px] w-full trans-200 ${
          open ? 'translate-x-0 opacity-1' : 'translate-x-full opacity-10'
        }`}>
        <Link href='/user' className='group flex items-center gap-2 mb-3 cursor-pointer'>
          <Image
            className='rounded-full shadow-md wiggle-0'
            src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
            height={40}
            width={40}
            alt='avatar'
          />
          <span className='font-semibold font-body tracking-wide text-xl'>
            {curUser?.firstName && curUser?.lastName
              ? `${curUser.firstName} ${curUser.lastName}`
              : curUser?.username}
          </span>
        </Link>

        {/* Links */}
        <ul>
          {adminLinks.map(({ title, Icon, links }) => (
            <li className='flex items-center gap-2' key={title}>
              {/* "All" Link */}
              <Link
                href={links[0].href}
                className='group flex flex-grow items-center gap-2 group rounded-lg p-2 trans-200 hover:bg-secondary font-body tracking-wide'
                onClick={() => setOpen(false)}>
                <Icon size={18} className='wiggle' />
                {links[0].title}
              </Link>

              {/* "Add" Link */}
              {links[1] && (
                <Link
                  href={links[1].href}
                  className='group flex justify-center items-center flex-shrink-0 rounded-full border-2 border-white p-[3px] hover:scale-110 trans-200 hover:border-primary'
                  onClick={() => setOpen(false)}>
                  <FaPlus size={10} className='group-hover:text-primary wiggle' />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default AdminMenu
