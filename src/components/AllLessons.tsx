'use client'

import { IChapter } from '@/models/ChapterModel'
import { getLearningChaptersApi } from '@/requests/chapterRequest'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Chapter from './Chapter'
import Divider from './Divider'

function AllLessons() {
  // hooks
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string

  // states
  const [chapters, setChapters] = useState<IChapter[]>([])

  // get all chapters with lessons
  useEffect(() => {
    const getChaptersWithLessons = async () => {
      try {
        // send request to get all chapters with lessons
        const { chapters } = await getLearningChaptersApi(courseId)

        console.log('chapters:', chapters)

        // set chapters
        setChapters(chapters)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getChaptersWithLessons()
  }, [courseId])

  return (
    <div className=''>
      <Divider size={4} />

      <div className='border border-dark rounded-lg shaodow-lg bg-white text-2xl font-semibold h-[40px] flex items-center justify-center'>
        All Lessons
      </div>

      <Divider size={2} />

      <ul className='flex flex-col gap-2'>
        {chapters.map(chapter => (
          <Chapter chapter={chapter} lessonId={lessonId} courseId={courseId} key={chapter._id} />
        ))}
      </ul>
    </div>
  )
}

export default AllLessons
