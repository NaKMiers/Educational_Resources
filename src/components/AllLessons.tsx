'use client'

import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IChapter } from '@/models/ChapterModel'
import { ILesson } from '@/models/LessonModel'
import { getLearningChaptersApi } from '@/requests/chapterRequest'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import Chapter from './Chapter'
import Divider from './Divider'
import Link from 'next/link'

function AllLessons() {
  // hooks
  const dispatch = useAppDispatch()
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string

  // states
  const [chapters, setChapters] = useState<IChapter[]>([])
  const [nextLesson, setNextLesson] = useState<string>()
  const [prevLesson, setPrevLesson] = useState<string>()

  // get all chapters with lessons
  useEffect(() => {
    const getChaptersWithLessons = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to get all chapters with lessons
        const { chapters } = await getLearningChaptersApi(courseId)

        console.log('chapters: ', chapters)

        // set chapters
        setChapters(chapters)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getChaptersWithLessons()
  }, [dispatch, courseId])

  // find next and prev lesson
  useEffect(() => {
    const lessons: ILesson[] = chapters.map(chapter => chapter.lessons).flat() as ILesson[]
    const curLessonIndex = lessons.findIndex(lesson => lesson._id === lessonId)

    console.log('lessons', lessons)
    console.log('curLessonIndex', curLessonIndex)

    if (curLessonIndex > 0) {
      setPrevLesson(lessons[curLessonIndex - 1]._id)
    }

    if (curLessonIndex < lessons.length - 1) {
      setNextLesson(lessons[curLessonIndex + 1]._id)
    }
  }, [chapters, lessonId])

  return (
    <div className='flex flex-col h-full'>
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

      <Divider size={2} />

      {/* Navigator */}
      <div className='flex flex-1 items-end pb-2'>
        <div className='py-2 w-full bg-slate-800 flex items-center justify-between px-3 gap-21 rounded-lg'>
          {prevLesson && (
            <Link
              href={`/learning/${courseId}/${prevLesson}`}
              className={`group flex items-center gap-2 rounded-lg px-2 py-1 bg-slate-200 border-2 border-dark hover:bg-white trans-200  ${
                !nextLesson ? 'flex-1 justify-center' : ''
              }`}>
              <FaChevronCircleLeft size={20} className='wiggle text-dark' />
              <span className='font-semibold text-dark'>Previous</span>
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/learning/${courseId}/${nextLesson}`}
              className={`group flex items-center gap-2 rounded-lg px-2 py-1 bg-slate-200 border-2 border-dark hover:bg-white trans-200 ${
                !prevLesson ? 'flex-1 justify-center' : ''
              }`}>
              <span className='font-semibold text-dark'>Next</span>
              <FaChevronCircleRight size={20} className='wiggle text-dark' />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllLessons
