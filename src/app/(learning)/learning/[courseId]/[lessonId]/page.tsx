'use client'

import Divider from '@/components/Divider'
import { ICourse } from '@/models/CourseModel'
import { ILesson } from '@/models/LessonModel'
import { getLessonApi } from '@/requests'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaChevronCircleLeft, FaChevronCircleRight, FaQuestion } from 'react-icons/fa'
import { IoChevronBackCircleOutline } from 'react-icons/io5'

function LessonPage({
  params: { courseId, lessonId },
}: {
  params: { courseId: string; lessonId: string }
}) {
  // hooks

  // states
  const [lesson, setLesson] = useState<ILesson | null>(null)

  useEffect(() => {
    const getLesson = async () => {
      // get lesson for learning
      try {
        const { lesson } = await getLessonApi(lessonId)
        setLesson(lesson)

        console.log('lesson:', lesson)
      } catch (err: any) {
        console.log(err)
      }
    }

    getLesson()
  }, [lessonId])

  return (
    <div className='w-full'>
      <Divider size={5} />

      <h2 className='flex items-center gap-2 font-semibold text-3xl px-21'>
        <Link href='/'>
          <IoChevronBackCircleOutline size={36} className='wiggle' />
        </Link>
        <span>{(lesson?.courseId as ICourse)?.title}</span>
      </h2>
      <Divider size={4} />

      {/* Source */}
      <div className='px-3'>
        <div className='aspect-video w-full rounded-lg shadow-lg overflow-hidden'>
          {lesson?.sourceType === 'embed' ? (
            <iframe
              className='w-full h-full object-contain'
              src={lesson?.source}
              title='The Largest Black Hole in the Universe - Size Comparison'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen
            />
          ) : null}
        </div>
      </div>
      <Divider size={4} />

      {/* Title */}
      <h1 className='text-ellipsis line-clamp-2 w-full text-4xl font-body tracking-wider px-3' title=''>
        {lesson?.title}
      </h1>

      {/* Description */}
      <div className='px-21'>{lesson?.description}</div>

      {/* Question */}
      <Link
        href='/question'
        className='absolute bottom-[70px] right-2 px-2 py-1 bg-slate-200  flex items-center rounded-lg hover:bg-dark-100 hover:text-white trans-200 shadow-lg'>
        <span className='font-semibold text-lg'>Ask Question </span>
        <FaQuestion size={18} />
      </Link>

      {/* Navigator */}
      <div className='flex flex-1 items-end pt-9'>
        <div className='py-2 w-full bg-slate-800 flex items-center justify-between px-3 gap-21'>
          <Link
            href='/'
            className='group flex items-center gap-2 rounded-lg px-2 py-1 bg-slate-200 border-2 border-dark hover:bg-white trans-200'>
            <FaChevronCircleLeft size={20} className='wiggle' />
            <span className='text-xl'>Previous</span>
          </Link>
          <Link
            href='/'
            className='group flex items-center gap-2 rounded-lg px-2 py-1 bg-slate-200 border-2 border-dark hover:bg-white trans-200'>
            <span className='text-xl'>Next</span>
            <FaChevronCircleRight size={20} className='wiggle' />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LessonPage
