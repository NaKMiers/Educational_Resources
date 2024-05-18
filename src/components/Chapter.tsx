'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import Divider from './Divider'
import { IChapter } from '@/models/ChapterModel'

interface ChapterProps {
  chapter: IChapter
  courseId: string
  lessonId: string
  className?: string
}

function Chapter({ chapter, courseId, lessonId, className = '' }: ChapterProps) {
  // hooks

  // states
  const [open, setOpen] = useState<boolean>(
    chapter.lessons?.map(lesson => lesson._id).includes(lessonId) || false
  )

  return (
    <ul className={`flex flex-col gap-y-21 ${className}`}>
      <li className='bg-slate-800 rounded-lg shaodow-lg'>
        <p
          className='font-semibold text-white flex justify-between items-center py-2 px-3 cursor-pointer'
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
              className={`bg-white rounded-md py-2 px-3 hover:bg-sky-100 trans-200 ${
                lesson._id === lessonId ? 'bg-sky-100 font-semibold' : ''
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
