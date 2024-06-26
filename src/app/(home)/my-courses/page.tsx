'use client'

import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import Pagination from '@/components/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { getMyCoursesApi } from '@/requests'
import { Link } from '@react-email/components'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function MyCoursesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [courses, setCourses] = useState<ICourse[]>([])

  // get my courses
  useEffect(() => {
    const getMyCourses = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to get my courses
        const { courses } = await getMyCoursesApi()
        setCourses(courses)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    if (curUser?._id) {
      getMyCourses()
    }
  }, [dispatch, curUser?._id])

  return (
    <div className='px-21'>
      <Divider size={6} />

      {/* Heading */}
      <h1 className='text-4xl font-semibold px-21 text-center'>My Courses ({courses.length || ''})</h1>

      <Divider size={8} border />

      {/* MAIN List */}
      {!!courses.length ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-21'>
          {courses.map(course => (
            <CourseCard course={course} key={course._id} hideBadge />
          ))}
        </div>
      ) : (
        <div className='font-body tracking-wider text-center'>
          <p className='italic'>
            You haven&apos;t enrolled in any courses yet. <br />
          </p>
          <Link
            href='/courses'
            className='text-sky-500 underline underline-offset-2 hover:text-sky-700 hover:tracking trans-200'
          >
            Explore our courses and start learning today!
          </Link>
        </div>
      )}

      <Divider size={28} />
    </div>
  )
}

export default MyCoursesPage
