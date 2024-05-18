import Divider from '@/components/Divider'
import LoadingButton from '@/components/LoadingButton'
import { IComment } from '@/models/CommentModel'
import { ICourse } from '@/models/CourseModel'
import { getCoursePageApi } from '@/requests'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Course',
}

async function CoursePage({ params: { slug } }: { params: { slug: string } }) {
  // Data
  let course: ICourse | null = null
  let relatedCourses: ICourse[] = []
  let comments: IComment[] = []

  // MARK: Get Data
  try {
    // revalidate every 1 minute
    const data = await getCoursePageApi(slug)
    console.log('data', data)

    course = data.course
    relatedCourses = data.relatedCourses
    comments = data.comments
  } catch (err: any) {
    return notFound()
  }

  return (
    <div className='pt-9 min-h-screen'>
      <div className='p-21'>
        <h1 className='text-4xl text-center font-semibold'>{course?.title}</h1>

        <Divider size={4} />

        <p className='text-justify'>{course?.description}</p>

        <Divider />

        <div className='flex flex-wrap items-center justify-center'>
          <button className='rounded-lg shadow-lg bg-sky-200 px-3 py-2 font-semibold border-2 border-black hover:bg-black hover:text-white trans-200'>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoursePage
