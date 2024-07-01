'use client'

import { ICourse } from '@/models/CourseModel'
import Image from 'next/image'
import Link from 'next/link'
import Divider from './Divider'
import Heading from './Heading'

interface BestSellerProps {
  courses: ICourse[]
  className?: string
}

function BestSeller({ courses, className = '' }: BestSellerProps) {
  return (
    <div className={`max-w-1200 mx-auto px-21 ${className}`}>
      <div className='flex items-center justify-center'>
        <Image
          className='object-cover'
          src='/images/award.svg'
          width={200}
          height={200}
          alt='thumbnail'
        />
      </div>

      <Divider size={12} />

      <Heading title='Best Seller' />

      <Divider size={12} />

      <div className='grid grid-cols-1 md:grid-cols-3 gap-21'>
        {courses.map((course, index) => (
          <Link
            href={`/${course.slug}`}
            className='rounded-lg shadow-lg overflow-hidden group'
            key={course._id}
          >
            <div className='aspect-video w-full shadow-lg'>
              <Image
                className='w-full h-full object-cover group-hover:scale-105 trans-500'
                src={course.images[0]}
                width={300}
                height={300}
                alt='thumbnail'
              />
            </div>

            <div className='relative w-full rounded-t-l g flex px-21 pt-10 pb-4 gap-21 justify-between bg-white'>
              <span className='font-semibold text-lg'>Sold</span>
              <span className='font-semibold text-lg'>{course.joined}</span>

              {index <= 2 && (
                <span className='absolute w-[60px] h-[60px] right-8 -top-5'>
                  <Image
                    className='w-full h-full object-cover'
                    src={`/images/top-${index + 1}-badge.png`}
                    fill
                    alt='badge'
                  />
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BestSeller
