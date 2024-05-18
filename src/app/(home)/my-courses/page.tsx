'use client'

import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import Meta from '@/components/Meta'
import Pagination from '@/components/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { ITag } from '@/models/TagModel'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function MyCoursesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user

  let query: string = ''
  let amount: number = 0
  let chops: { [key: string]: number } | null = null
  let itemPerPage = 8

  // states
  const [courses, setCourses] = useState<ICourse[]>([])
  const [tags, setTags] = useState<ITag[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])

  // get my courses
  useEffect(() => {
    const getMyCourses = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
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
      <h1 className='text-4xl font-semibold px-21'>My Courses</h1>

      {/* Filter & Search Bar */}
      <div className='flex justify-between'>
        {/* Filter */}
        <Meta searchParams={searchParams} type='ctg' items={categories} chops={chops} />
      </div>

      <Divider size={5} />

      {/* MAIN List */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-21'>
        {courses.map(course => (
          <CourseCard course={course} key={course._id} />
        ))}
      </div>

      <Divider size={8} />

      {/* Pagination */}
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      <Divider size={20} />
    </div>
  )
}

export default MyCoursesPage
