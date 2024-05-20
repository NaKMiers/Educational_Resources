'use client'

import { IChapter } from '@/models/ChapterModel'
import Link from 'next/link'
import { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import Divider from './Divider'

interface ChapterProps {
  chapter: IChapter
  courseId: string
  lessonId?: string
  className?: string
}

function Chapter({ chapter, courseId, lessonId = '', className = '' }: ChapterProps) {
  // states
  const [open, setOpen] = useState<boolean>(
    chapter.lessons?.map(lesson => lesson._id).includes(lessonId) || false
  )

  return (
    <ul className={`flex flex-col gap-y-21 ${className}`}>
      <li className='bg-slate-800 rounded-lg shaodow-lg'>
        <p
          className={`${
            chapter.lessons?.some(lesson => lesson._id === lessonId) ? 'text-orange-500' : 'text-white'
          } font-semibold flex justify-between items-center py-2 px-3 cursor-pointer`}
          onClick={() => setOpen(!open)}>
          {chapter.title} <FaAngleDown size={18} className='rotate-0' />
        </p>

        <ul
          className={`flex flex-col px-2 gap-1 ${
            open ? 'max-h-auto' : 'max-h-0'
          } duration-300 transition-all overflow-hidden`}>
          {chapter.lessons?.map(lesson => (
            <Link
              href={`/learning/${courseId}/${lesson._id}`}
              className={`bg-white rounded-md py-2 px-3 hover:bg-sky-200 trans-200 ${
                lesson._id === lessonId ? 'font-semibold text-orange-500' : ''
              }`}
              key={lesson._id}>
              {lesson.title}
            </Link>
          ))}
          <Divider size={2} />
        </ul>
      </li>
    </ul>
  )
}

export default Chapter
