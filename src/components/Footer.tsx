'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className='border-t-2 border-slate-300 px-21'>
      {/* Head */}
      <div className='flex items-center justify-between gap-21 border-b-2 border-slate-300'>
        <div className='flex items-center gap-4 py-2'>
          <div className='flex items-center gap-2'>
            <div className='w-[40px] h-[40px] aspect-square rounded-full shadow-lg overflow-hidden'>
              <Image src='/images/logo.png' width={32} height={32} alt='github' />
            </div>
            <span className='font-body text-sky-700 font-bold text-3xl'>ERE</span>
          </div>

          <span className='font-bold text-dark text-lg hidden md:block'>Educational Resources</span>
        </div>

        <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          <Link href='/'>
            <Image src='/images/github-logo.png' width={32} height={32} alt='github' />
          </Link>
          <Link href='/'>
            <Image src='/images/google-logo.png' width={32} height={32} alt='google' />
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className='grid grid-cols-1 md:grid-cols-3 py-21 gap-21'>
        <div>
          <h3 className='font-bold text-xl'>ABOUT US</h3>

          <ul>
            <li className='hover:tracking-wider duration-300 transition-all py-1'>
              <Link href='/' className='underline underline-offset-2'>
                Home
              </Link>
            </li>
            <li className='hover:tracking-wider duration-300 transition-all py-1'>
              <Link href='/courses' className='underline underline-offset-2'>
                Course
              </Link>
            </li>
            <li className='hover:tracking-wider duration-300 transition-all py-1'>
              <Link href='/question' className='underline underline-offset-2'>
                Forum
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='font-bold text-xl'>CONTACT</h3>

          <ul>
            <li className='hover:tracking-wider duration-300 transition-all py-1'>
              <Link href='https://facebook.com' className='underline underline-offset-2'>
                https://facebook.com
              </Link>
            </li>
            <li className='hover:tracking-wider duration-300 transition-all py-1'>
              <Link href='https://github.com' className='underline underline-offset-2'>
                https://github.com
              </Link>
            </li>
            <li className='hover:tracking-wider duration-300 transition-all py-1'>
              <Link href='https://ere-eta.vercel.app' className='underline underline-offset-2'>
                https://ere-eta.vercel.app
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className='font-bold text-xl'>CERTIFIED BY</h3>

          <ul>
            <li className='hover:tracking-wider duration-300 transition-all py-1'>
              <Image src='/images/certificate-1.png' width={130} height={130} alt='certificate' />
            </li>
            <li className='hover:tracking-wider duration-300 transition-all py-1'>
              <Image src='/images/certificate-2.png' width={130} height={130} alt='certificate' />
            </li>
          </ul>
        </div>
      </div>

      <div className='mb-[72px] md:mb-auto' />
    </footer>
  )
}

export default Footer
