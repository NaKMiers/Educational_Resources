'use client'

import { IChapter } from '@/models/ChapterModel'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import Divider from './Divider'
import { duration } from '@/utils/time'

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

  // refs
  const chapterRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (open) {
      if (!chapter.lessons || !chapterRef.current) return

      const origin = 52
      const length = chapter.lessons.length * 40
      const totalGap = (chapter.lessons.length - 1) * 4
      const totalHeight = origin + length + totalGap

      chapterRef.current.style.setProperty('max-height', `${totalHeight}px`)
    } else {
      chapterRef.current?.style.removeProperty('max-height')
    }
  }, [open, chapter.lessons])

  return (
    <ul className={`flex flex-col gap-y-21 ${className}`}>
      <li className='bg-slate-800 rounded-lg shaodow-lg'>
        <p
          className={`${
            chapter.lessons?.some(lesson => lesson._id === lessonId) ? 'text-orange-500' : 'text-white'
          } font-semibold flex justify-between items-center py-2 px-3 cursor-pointer`}
          onClick={() => setOpen(!open)}
        >
          {chapter.title} <FaAngleDown size={18} className={`${open ? 'rotate-180' : ''} trans-200`} />
        </p>

        <ul
          className={`flex flex-col px-2 gap-[4px] ${open ? `` : 'max-h-0'} trans-300 overflow-hidden`}
          ref={chapterRef}
        >
          {chapter.lessons?.map(lesson => (
            <Link
              href={`/learning/${courseId}/${lesson._id}`}
              className={`bg-white rounded-md py-2 px-3 gap-4 hover:bg-sky-200 trans-200 flex items-center justify-between ${
                lesson._id === lessonId ? 'font-semibold text-orange-500' : ''
              }`}
              title={lesson.title}
              key={lesson._id}
            >
              <span className='text-ellipsis line-clamp-1'>{lesson.title}</span>
              <span className='text-xs font-semibold text-nowrap text-slate-500'>
                {duration(lesson.duration)}
              </span>
            </Link>
          ))}
          <Divider size={2} />
        </ul>
      </li>
    </ul>
  )
}

export default Chapter
