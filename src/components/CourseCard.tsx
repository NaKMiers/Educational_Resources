'use client'

import { useAppDispatch } from '@/libs/hooks'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Divider from './Divider'
import { applyFlashSalePrice, countPercent } from '@/utils/number'
import { IFlashSale } from '@/models/FlashSaleModel'

interface CourseCardProps {
  course: ICourse
  className?: string
}

function CourseCard({ course, className = '' }: CourseCardProps) {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <div
      className={`relative w-full h-full p-4 bg-white bg-opacity-80 shadow-lg rounded-xl hover:-translate-y-1 transition duration-500 ${className}`}>
      {/* MARK: Thumbnails */}
      <Link
        href={`/${course.slug}`}
        prefetch={false}
        className='relative aspect-video rounded-lg overflow-hidden shadow-lg block'>
        <div className='flex w-full overflow-x-scroll snap-x snap-mandatory'>
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
      {course.oldPrice && (
        <div className='absolute z-10 -top-2 -left-2 rounded-tl-lg rounded-br-lg bg-yellow-400 p-1 max-w-10 text-white font-semibold font-body text-center text-[13px] leading-4'>
          Sale{' '}
          {countPercent(
            applyFlashSalePrice(course.flashSale as IFlashSale, course.price) || 0,
            course.oldPrice
          )}
        </div>
      )}

      <Divider size={3} />

      {/* Categories */}
      <div className='flex flex-wrap gap-1'>
        {course.categories.map(cat => (
          <Link
            href={`/courses?ctg=${(cat as ICategory).slug}`}
            key={(cat as ICategory).slug}
            className='text-xs font-semibold font-body tracking-wide text-dark px-2 py-1 shadow rounded-lg bg-sky-300'>
            {(cat as ICategory).title}
          </Link>
        ))}
      </div>

      {/* Title */}
      <Link href={`/${course.slug}`} prefetch={false}>
        <h3
          className='font-body text-[18px] text-dark tracking-wide leading-[22px] my-3'
          title={course.title}>
          {course.title}
        </h3>
      </Link>

      <p className='font-body tracking-wider text-sm'>
        {/* {course.description} */}
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure, eligendi. Neque nulla veritatis,
        soluta sit eveniet ipsam facilis odio cumque doloribus adipisci provident natus unde ducimus iste
        maxime doloremque possimus pariatur impedit quae saepe nemo? Consequatur a illum tempore dolore
        culpa obcaecati? Corrupti vero non iusto at nemo, dolores et.
      </p>

      {/* Price */}
      {/* <Price
        price={course.price}
        oldPrice={course.oldPrice}
        flashSale={course.flashSale as IFlashSale}
        className='mb-2'
      /> */}

      {/* Basic Information */}
      {/* <div className='flex items-center font-body tracking-wide'>
        <FaCircleCheck size={16} className='text-darker' />
        <span className='font-bold text-darker ml-1'>Student:</span>
        <span className='text-red-500 ml-1'>{course.joined}</span>
      </div> */}

      {/* MARK: Action Buttons */}
      {/* <div className='flex items-center justify-end md:justify-start gap-2 mt-2'>
        <button
          className={`bg-secondary rounded-md text-white px-2 py-[5px] font-semibold font-body tracking-wider text-nowrap hover:bg-primary common-transition ${
            isLoading ? 'bg-slate-200 pointer-events-none' : ''
          }`}
          disabled={isLoading}>
          MUA NGAY
        </button>
        <button
          className={`bg-primary rounded-md py-2 px-3 group hover:bg-primary-600 hover:bg-secondary common-transition ${
            isLoading ? 'pointer-events-none bg-slate-200' : ''
          }`}
          disabled={isLoading}>
          {isLoading ? (
            <RiDonutChartFill size={18} className='animate-spin text-white' />
          ) : (
            <FaCartPlus size={18} className='text-white wiggle' />
          )}
        </button>
        {['admin', 'editor'].includes(curUser?.role) && (
          <Link
            href={`/admin/course/all?_id=${course?._id}`}
            className='flex items-center justify-center h-[34px] border border-yellow-400 rounded-md px-3 group hover:bg-primary-600 common-transition'>
            <MdEdit size={18} className='wiggle text-yellow-400' />
          </Link>
        )}
      </div> */}
    </div>
  )
}

export default CourseCard
