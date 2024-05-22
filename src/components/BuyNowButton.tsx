'use client'

import { ICourse } from '@/models/CourseModel'
import { likeCourseApi } from '@/requests'
import { Link } from '@react-email/components'
import { getSession, useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa'

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
            className='flex-shrink-0 text-sky-500 cursor-pointer wiggle group-hover:text-slate-400'
            onClick={() => likeCourse('n')}
          />
        ) : (
          <FaRegThumbsUp
            size={16}
            className='flex-shrink-0 w-4 text-slate-400 cursor-pointer wiggle group-hover:text-sky-500'
            onClick={() => likeCourse('y')}
          />
        )}{' '}
        <span>{data.likes.length}</span>
      </button>
      <Link
        href={
          curUser?._id && curUser?.courses.map((course: any) => course.course).includes(course._id)
            ? `/learning/${course?._id}/continue`
            : `/checkout/${course?.slug}`
        }
        className={`h-[42px] w-full flex items-center justify-center border border-dark text-dark rounded-lg shadow-lg px-5 font-bold text-lg hover:bg-dark-0 hover:text-white trans-180`}>
        {curUser?._id && curUser?.courses.map((course: any) => course.course).includes(course._id)
          ? 'Continue Learning'
          : 'Buy Now'}
      </Link>
    </div>
  )
}

export default BuyNowButton
