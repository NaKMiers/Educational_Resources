'use client'

import { CardBody, CardContainer, CardItem } from '@/components/3dCard'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { applyFlashSalePrice, countPercent } from '@/utils/number'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { HiDotsVertical } from 'react-icons/hi'
import Price from './Price'

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
    <CardContainer className={`inter-var ${className}`}>
      <CardBody className='flex flex-col bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] h-auto rounded-xl p-6 border'>
        {course.oldPrice && !hideBadge && (
          <div className='absolute z-10 -top-2 -left-2 rounded-tl-lg rounded-br-lg bg-yellow-400 p-1 max-w-10 text-white font-semibold font-body text-center text-[13px] leading-4'>
            Sale{' '}
            {countPercent(
              applyFlashSalePrice(course.flashSale as IFlashSale, course.price) || 0,
              course.oldPrice
            )}
          </div>
        )}

        <CardItem translateZ='50' className='text-xl font-bold text-neutral-600 dark:text-white'>
          {course.title}
        </CardItem>
        <CardItem
          as='p'
          translateZ='60'
          className='text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300'
        >
          <p className='text-ellipsis line-clamp-2'>{course.description}</p>
        </CardItem>
        <CardItem translateZ='100' className='w-full mt-4'>
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
        </CardItem>

        {!!course.categories.length && (
          <CardItem translateZ='150' className='flex justify-between items-center mt-4'>
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
          </CardItem>
        )}

        <CardItem translateZ='120' className='flex w-full justify-between items-center mt-4'>
          {/* Price */}
          <Price
            price={course.price}
            oldPrice={course.oldPrice}
            flashSale={course.flashSale as IFlashSale}
            className='w-full'
          />
        </CardItem>

        <div className='flex flex-1 items-end justify-between mt-8'>
          <div className='flex items-center w-full'>
            <CardItem
              translateZ={50}
              className='w-full py-2 rounded-xl text-xs font-normal dark:text-white'
            >
              <Link
                href={
                  curUser?._id &&
                  curUser?.courses.map((course: any) => course.course).includes(course._id)
                    ? `/learning/${course?._id}/continue`
                    : `/checkout/${course?.slug}`
                }
                className='font-semibold h-[42px] flex w-full items-center justify-center rounded-lg shadow-lg bg-dark-100 text-white border-2 border-dark hover:bg-white hover:text-dark trans-300 hover:-translate-y-1'
              >
                {curUser?._id &&
                curUser?.courses.map((course: any) => course.course).includes(course._id)
                  ? 'Continue Learning'
                  : 'Buy Now'}
              </Link>
            </CardItem>

            {curUser?._id &&
              curUser.courses.map((course: any) => course.course).includes(course._id) && (
                <CardItem translateZ={20} as='button' className='pl-3 text-white'>
                  <div className='relative flex justify-center items-center pl-1 w-full h-[42px]'>
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
                </CardItem>
              )}
          </div>
        </div>
      </CardBody>
    </CardContainer>
  )
}

export default CourseCard
