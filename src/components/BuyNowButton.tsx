'use client'

import { ICourse } from '@/models/CourseModel'
import { likeCourseApi } from '@/requests'
import { Link } from '@react-email/components'
import { getSession, useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'

interface BuyNowButtonProps {
  course: ICourse
  className?: string
}

function BuyNowButton({ course, className = '' }: BuyNowButtonProps) {
  // hooks
  const { data: session } = useSession()

  // states
  const [curUser, setCurUser] = useState<any>(session?.user || null)
  const [data, setData] = useState<ICourse>(course)
  const [showActions, setShowActions] = useState<boolean>(false)

  // MARK: Side Effects
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

  // handel like / dislike course
  const likeCourse = useCallback(
    async (value: 'y' | 'n') => {
      try {
        // send request to like / dislike comment
        await likeCourseApi(course._id, value)
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      }

      setData(prev => ({
        ...prev,
        likes:
          value === 'y' ? [...prev.likes, curUser._id] : prev.likes.filter(id => id !== curUser._id),
      }))
    },
    [course._id, curUser?._id]
  )

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <button className='group h-[42px] min-w-[42px] px-3 flex items-center justify-center font-semibold gap-1.5 border border-dark rounded-lg'>
        {data.likes.includes(curUser?._id) ? (
          <FaThumbsUp
            size={16}
            className='flex-shrink-0 text-rose-500 cursor-pointer wiggle group-hover:text-slate-400'
            onClick={() => likeCourse('n')}
          />
        ) : (
          <FaRegThumbsUp
            size={16}
            className='flex-shrink-0 w-4 text-slate-400 cursor-pointer wiggle group-hover:text-rose-500'
            onClick={() => likeCourse('y')}
          />
        )}{' '}
        <span className='-mb-0.5'>{data.likes.length}</span>
      </button>
      <Link
        href={
          curUser?._id && curUser?.courses.map((course: any) => course.course).includes(course._id)
            ? `/learning/${course?._id}/continue`
            : `/checkout/${course?.slug}`
        }
        className={`h-[42px] w-full flex items-center justify-center border border-dark rounded-lg shadow-lg px-5 font-bold text-lg hover:bg-dark-0 group trans-200`}
      >
        <span className='text-dark group-hover:text-white trans-200'>
          {curUser?._id && curUser?.courses.map((course: any) => course.course).includes(course._id)
            ? 'Continue Learning'
            : 'Buy Now'}
        </span>
      </Link>
      {curUser?._id && curUser.courses.map((course: any) => course.course).includes(course._id) && (
        <div className='relative flex justify-end items-center -ml-2.5'>
          <button className='group' onClick={() => setShowActions(prev => !prev)}>
            <HiDotsVertical size={24} className='wiggle' />
          </button>

          <div
            className={`fixed z-10 top-0 left-0 right-0 bottom-0 ${showActions ? '' : 'hidden'}`}
            onClick={() => setShowActions(false)}
          />
          <div
            className={`${
              showActions ? 'max-w-[100px] max-h-[40px] px-1.5 py-1' : 'max-w-0 max-h-0 p-0'
            }  overflow-hidden absolute z-20 top-1/2 -translate-y-1/2 right-[75%] flex gap-2 rounded-md trans-300`}
          >
            <Link
              href={`/checkout/${course.slug}`}
              className={`font-bold text-nowrap px-1.5 py-1 text-[10px] bg-white hover:bg-dark-0 border border-dark rounded-md shadow-md group trans-200`}
            >
              <span className='text-dark trans-200 group-hover:text-white'>Buy as a gift</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuyNowButton
