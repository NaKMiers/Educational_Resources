'use client'

import Divider from '@/components/Divider'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { FaEdit } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'

function PersonalSetting() {
  // hook
  const { data: session } = useSession()
  const curUser: any = session?.user

  return (
    <div className='max-w-1200 mx-auto'>
      <Divider size={5} />

      {/* Top */}
      <div className='relative rounded-lg border border-dark shadow-lg p-4'>
        <div className='flex gap-2'>
          <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
            <Image
              src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
              width={80}
              height={80}
              alt='avatar'
            />
          </div>
          <div className='font-body tracking-wider'>
            <p className='font-semibold text-xl'>
              {curUser?.firstName && curUser?.lastName
                ? `${curUser.firstName} ${curUser.lastName}`
                : curUser?.username}
            </p>
            <p> {curUser?.email}</p>
            <p>{curUser?.phone}</p>
            <p>{curUser?.address}</p>
          </div>
        </div>

        {/* Edit Button */}
        <button className='flex gap-1 items-center justify-center absolute top-2 right-2 rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'>
          <MdEdit size={20} />
          <span className='font-semibold'>Edit</span>
        </button>
      </div>

      {/* Center */}
      <div className='relative rounded-lg border border-dark shadow-lg py-8'>
        <div className='absolute font-semibold text-2xl w-[calc(100%_-_20px)] left-1/2 -translate-x-1/2 h-0.5 bg-slate-700'>
          <span className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-sm bg-white px-2 py-1 rounded-lg'>
            Personal Information
          </span>
        </div>

        <Divider size={5} />

        <div className='relative grid grid-cols-2 p-5 gap-21'>
          <button className='flex gap-1 items-center justify-center absolute top-2 right-2 rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'>
            <MdEdit size={20} />
            <span className='font-semibold'>Edit</span>
          </button>

          <div className='font-semibold'>
            <p className='text-slate-500'>First Name</p>
            <p>{curUser?.firstName}</p>
          </div>
          <div className='font-semibold'>
            <p className='text-slate-500'>Last Name</p>
            <p>{curUser?.lastName}</p>
          </div>
          <div className='font-semibold'>
            <p className='text-slate-500'>Bio</p>
            <p>{curUser?.bio || 'Empty'}</p>
          </div>
          <div className='font-semibold'>
            <p className='text-slate-500'>Job</p>
            <p>{curUser?.job || 'Empty'}</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
    </div>
  )
}

export default PersonalSetting
