'use client'

import Image from 'next/image'
import Link from 'next/link'
import Divider from './Divider'
import { ICategory } from '@/models/CategoryModel'
import { useEffect, useState } from 'react'
import { getCategoriesApi } from '@/requests'
import toast from 'react-hot-toast'

function Footer() {
  // states
  const [categories, setCategories] = useState<ICategory[]>([])

  // get categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const { categories } = await getCategoriesApi()
        setCategories(categories)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    getCategories()
  }, [])

  return (
    <footer className='border-t-2 border-slate-300 px-21'>
      {/* Head */}
      <div className='max-w-1200 mx-auto flex items-center justify-between gap-21'>
        <div className='flex items-center gap-4 py-2'>
          <div className='flex items-center gap-2'>
            <Link
              href='/'
              className='w-[32px] h-[32px] aspect-square rounded-lg shadow-lg overflow-hidden'
            >
              <Image
                className='w-full h-full object-cover'
                src='/images/logo.png'
                width={32}
                height={32}
                alt='github'
              />
            </Link>
            <span className='font-body text-sky-700 font-bold text-3xl'>ERE</span>
          </div>

          <span className='font-bold text-dark text-lg hidden md:block'>Educational Resources</span>
        </div>

        <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          <Link href='https://github.com/NaKMiers' target='_blank'>
            <Image
              src='/images/github-logo.png'
              className='wiggle-1'
              width={32}
              height={32}
              alt='github'
            />
          </Link>
          <Link href='mailto:cosanpha.omega@gmail.com' target='_blank'>
            <Image src='/images/gmail.png' className='wiggle-1' width={32} height={32} alt='gmail' />
          </Link>
        </div>
      </div>

      <Divider size={0} border />

      {/* Body */}
      <div className='max-w-1200 mx-auto grid grid-cols-1 md:grid-cols-7 py-21 gap-7 text-center md:text-left'>
        <div className='flex flex-col col-span-3'>
          <h3 className='font-bold text-xl'>ABOUT US</h3>

          <p className='font-body tracking-wider mt-2 hover:tracking-widest trans-200'>
            ERE (Education Resources) brings you online learning solutions, studying online at home at an
            economical cost. best. This is suitable for those whose finances are still tight and limited
            (students, real trainees, new graduates,...) but can still participate in top value courses
            to Develop professional skills and develop your career. If you want to save more on your
            investment If you are interested in learning, ERE is the ideal destination for you.
          </p>
        </div>

        <div className='flex flex-col col-span-3'>
          <h3 className='font-bold text-xl'>Categories</h3>

          <ul className='flex flex-wrap justify-center md:justify-start gap-2 mt-3'>
            {categories.map(category => (
              <li
                className='rounded-md px-1.5 py-1 border border-dark text-sm hover:bg-secondary hover:border-secondary hover:text-white trans-200'
                key={category._id}
              >
                <Link href={`/courses/?ctg=${category.slug}`}>{category.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col col-span-1 items-center md:items-start'>
          <h3 className='font-bold text-xl'>CERTIFIED BY</h3>

          <ul className='mt-2'>
            <li className='hover:tracking-wider trans-300 py-1'>
              <Image src='/images/certificate-1.png' width={130} height={130} alt='certificate' />
            </li>
            <li className='hover:tracking-wider trans-300 py-1'>
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
