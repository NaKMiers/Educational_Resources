'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenSidebar, setPageLoading } from '@/libs/reducers/modalReducer'
import { IChapter } from '@/models/ChapterModel'
import { ILesson } from '@/models/LessonModel'
import { getLearningChaptersApi } from '@/requests/chapterRequest'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import Chapter from './Chapter'
import Divider from './Divider'
import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from 'react-icons/bs'

function AllLessons() {
  // hooks
  const dispatch = useAppDispatch()
  const openSidebar = useAppSelector(state => state.modal.openSidebar)
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string

  // states
  const [chapters, setChapters] = useState<IChapter[]>([])
  const [nextLesson, setNextLesson] = useState<string>('')
  const [prevLesson, setPrevLesson] = useState<string>('')

  // get all chapters with lessons
  useEffect(() => {
    const getChaptersWithLessons = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to get all chapters with lessons
        const { chapters } = await getLearningChaptersApi(courseId)

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

    setPrevLesson(curLessonIndex > 0 ? lessons[curLessonIndex - 1]._id : '')
    setNextLesson(curLessonIndex < lessons.length - 1 ? lessons[curLessonIndex + 1]._id : '')
  }, [chapters, lessonId])

  return (
    <>
      {/* Pusher */}
      <div className={`${openSidebar ? 'sm:max-w-[300px]' : 'sm:max-w-0'} sm:w-full trans-300`} />

      {/* Sidebar */}
      <div
        className={`fixed z-20 top-0 bottom-[72px] md:top-[72px] md:bottom-0 left-0 w-full sm:max-w-[300px] px-3 flex flex-col trans-300 border-r-2 border-dark bg-gradient-to-tr from-primary to-secondary ${
          openSidebar ? 'translate-x-0' : '-translate-x-full'
        } pt-[18px]`}
      >
        <div className='flex items-center justify-between gap-21 rounded-lg text-2xl font-semibold h-[40px] text-white'>
          <span>All Lessons</span>

          <button
            className={`group rounded-lg py-1.5 trans-300`}
            onClick={() => dispatch(setOpenSidebar(!openSidebar))}
          >
            <BsLayoutSidebarInset size={20} className='wiggle' />
          </button>
        </div>

        <Divider size={2} />

        <ul className='flex flex-col gap-2 overflow-y-auto no-scrollbar'>
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
                }`}
              >
                <FaChevronCircleLeft size={20} className='wiggle text-dark' />
                <span className='font-semibold text-dark'>Previous</span>
              </Link>
            )}
            {nextLesson && (
              <Link
                href={`/learning/${courseId}/${nextLesson}`}
                className={`group flex items-center gap-2 rounded-lg px-2 py-1 bg-slate-200 border-2 border-dark hover:bg-white trans-200 ${
                  !prevLesson ? 'flex-1 justify-center' : ''
                }`}
              >
                <span className='font-semibold text-dark'>Next</span>
                <FaChevronCircleRight size={20} className='wiggle text-dark' />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AllLessons
