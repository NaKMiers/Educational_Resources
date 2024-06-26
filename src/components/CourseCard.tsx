'use client'

import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { applyFlashSalePrice, countPercent } from '@/utils/number'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import Divider from './Divider'
import Price from './Price'
import { useState } from 'react'
import { IUser } from '@/models/UserModel'
import { HiDotsVertical } from 'react-icons/hi'

interface CourseCardProps {
  course: ICourse
  hideBadge?: boolean
  className?: string
}

function CourseCard({ course, hideBadge, className = '' }: CourseCardProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [showActions, setShowActions] = useState<boolean>(false)

  return (
    <div
      className={`relative flex flex-col w-full h-full p-4 bg-white bg-opacity-80 shadow-lg rounded-xl hover:-translate-y-1 transition duration-500 ${className}`}
    >
      {/* MARK: Thumbnails */}
      <Link
        href={`/${course.slug}`}
        prefetch={false}
        className='relative aspect-video rounded-lg overflow-hidden shadow-lg block group'
      >
        <div className='flex w-full overflow-x-scroll snap-x snap-mandatory hover:scale-105 trans-500'>
          {course.images.map(src => (
            <Image
              className='flex-shrink-0 snap-start w-full h-full object-cover'
              src={src}
              width={350}
              height={350}
              alt='netflix'
              key={src}
            />
          ))}
        </div>
      </Link>

      {/* Badge */}
      {course.oldPrice && !hideBadge && (
        <div className='absolute z-10 -top-2 -left-2 rounded-tl-lg rounded-br-lg bg-yellow-400 p-1 max-w-10 text-white font-semibold font-body text-center text-[13px] leading-4'>
          Sale{' '}
          {countPercent(
            applyFlashSalePrice(course.flashSale as IFlashSale, course.price) || 0,
            course.oldPrice
          )}
        </div>
      )}

      {/* Title */}
      <Link href={`/${course.slug}`} prefetch={false}>
        <h3
          className='font-body text-[21px] text-dark tracking-wider leading-[22px] my-4'
          title={course.title}
        >
          {course.title}
        </h3>
      </Link>

      {/* Price */}
      <Price
        price={course.price}
        oldPrice={course.oldPrice}
        flashSale={course.flashSale as IFlashSale}
      />

      <Divider size={2} />

      {/* Categories */}
      <div className='flex flex-wrap gap-1'>
        {course.categories.map(cat => (
          <Link
            href={`/courses?ctg=${(cat as ICategory).slug}`}
            key={(cat as ICategory).slug}
            className='text-xs font-semibold font-body tracking-wide text-dark px-2 py-1 shadow rounded-lg bg-sky-300'
          >
            {(cat as ICategory).title}
          </Link>
        ))}
      </div>

      <Divider size={2} />

      <p className='font-body tracking-wider text-sm max-h-[200px] overflow-auto'>
        {course.description}
      </p>

      <Divider size={3} />

      <div className='flex-1 flex items-end'>
        <Link
          href={
            curUser?._id && curUser?.courses.map((course: any) => course.course).includes(course._id)
              ? `/learning/${course?._id}/continue`
              : `/checkout/${course?.slug}`
          }
          className='font-semibold h-[42px] flex w-full items-center justify-center rounded-lg shadow-lg bg-dark-100 text-white border-2 border-dark hover:bg-white hover:text-dark trans-300 hover:-translate-y-1'
        >
          {curUser?._id && curUser?.courses.map((course: any) => course.course).includes(course._id)
            ? 'Continue Learning'
            : 'Buy Now'}
        </Link>
        {curUser?._id && curUser.courses.map((course: any) => course.course).includes(course._id) && (
          <div className='relative h-[42px] flex justify-end items-center pl-1'>
            <button className='group' onClick={() => setShowActions(prev => !prev)}>
              <HiDotsVertical size={24} className='wiggle' />
            </button>
            <div
              className={`${
                showActions ? 'max-w-[100px] max-h-[40px] px-1.5 py-1' : 'max-w-0 max-h-0 p-0'
              }  overflow-hidden absolute z-20 top-[80%] flex gap-2 rounded-md trans-300`}
            >
              <Link
                href={`/checkout/${course.slug}`}
                className={`font-bold text-nowrap px-1.5 py-1 text-[10px] bg-white hover:bg-dark-0 hover:text-white border border-dark text-dark rounded-md shadow-md trans-200`}
              >
                Buy as a gift
              </Link>
            </div>
          </div>
        )}
      </div>

      <Divider size={2} />
    </div>
  )
}

export default CourseCard
