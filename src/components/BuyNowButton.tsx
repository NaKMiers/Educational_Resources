'use client'

import { ICourse } from '@/models/CourseModel'
import { Link } from '@react-email/components'
import { getSession, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

interface BuyNowButtonProps {
  course: ICourse
  className?: string
}

function BuyNowButton({ course, className = '' }: BuyNowButtonProps) {
  // hooks
  const { data: session } = useSession()

  // states
  const [curUser, setCurUser] = useState<any>(session?.user || null)

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

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Link
        href={
          curUser?.courses.map((course: any) => course.course).includes(course._id)
            ? `/learning/${course?.slug}/continue`
            : `/checkout/${course?.slug}`
        }
        className={`h-[42px] w-full flex items-center justify-center border border-dark text-dark rounded-lg shadow-lg px-5 font-bold text-lg hover:bg-dark-0 hover:text-white trans-200`}>
        {curUser?.courses.map((course: any) => course.course).includes(course._id)
          ? 'Continue Learning'
          : 'Buy Now'}
      </Link>
    </div>
  )
}

export default BuyNowButton
