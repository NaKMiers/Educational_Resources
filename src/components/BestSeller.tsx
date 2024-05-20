import Image from 'next/image'
import React from 'react'
import Heading from './Heading'
import Divider from './Divider'
import { ICourse } from '@/models/CourseModel'

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
          <div className='relative rounded-lg shadow-lg aspect-square overflow-hidden' key={course._id}>
            <Image className='w-full h-full object-cover' src={course.images[0]} fill alt='thumbnail' />

            <div className='absolute left-0 bottom-0 w-full rounded-t-lg flex px-21 pt-10 pb-4 gap-21 justify-between bg-white'>
              <span className='font-semibold text-lg'>Sold</span>
              <span className='font-semibold text-lg'>{course.joined}</span>

              {index <= 2 && (
                <span className='absolute w-[80px] h-[80px] right-8 -top-5'>
                  <Image
                    className='w-full h-full object-cover'
                    src={`/images/top-${index + 1}-badge.png`}
                    fill
                    alt='badge'
                  />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestSeller
