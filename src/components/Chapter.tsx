'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import Divider from './Divider'

function Chapter() {
  // hooks

  // states
  const [open, setOpen] = useState<boolean>(false)

  return (
    <ul className='flex flex-col gap-y-21'>
      <li className='bg-slate-800 rounded-lg shaodow-lg'>
        <p
          className='font-semibold text-white flex justify-between items-center py-2 px-3 cursor-pointer'
          onClick={() => setOpen(!open)}>
          Chapter 1 <FaAngleDown size={18} className='rotate-0' />
        </p>

        <ul
          className={`flex flex-col px-2 gap-1 ${
            open ? 'max-h-[500px]' : 'max-h-0'
          } duration-300 transition-all overflow-hidden`}>
          {Array.from({ length: 10 }).map((item, index) => (
            <Link href='/learning' className='bg-white rounded-md py-2 px-3' key={index}>
              Lesosn {index + 1}
            </Link>
          ))}
          <Divider size={2} />
        </ul>
      </li>
    </ul>
  )
}

export default Chapter
