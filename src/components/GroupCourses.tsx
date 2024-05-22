'use client'

import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { IQuestion } from '@/models/QuestionModel'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import CourseCard from './CourseCard'
import Question from './QuestionItem'

interface GroupCoursesProps {
  category?: ICategory
  courses?: {
    course: ICourse
    progress: number
  }[]
  questions?: IQuestion[]
  hideTop?: boolean
  className?: string
  childClassName?: string
  bestSeller?: boolean
  child: 'course-card' | 'question'
}

function GroupCourses({
  category,
  courses = [],
  questions = [],
  child,
  hideTop,
  bestSeller,
  className = '',
  childClassName = 'w-full sm:w-1/2 px-21/2',
}: GroupCoursesProps) {
  // states
  const [isExpaned, setIsExpaned] = useState<boolean>(false)
  const [isMedium, setIsMedium] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // ref
  const slideTrackRef = useRef<HTMLDivElement>(null)

  // MARK: Handlers
  const handleDraging = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && !isExpaned && slideTrackRef.current) {
        slideTrackRef.current.scrollLeft -= e.movementX
      }
    },
    [isDragging, isExpaned]
  )

  // prev slide
  const prevSlide = useCallback(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.scrollTo({
        left: slideTrackRef.current.scrollLeft - slideTrackRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  // next slide
  const nextSlide = useCallback(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.scrollTo({
        left: slideTrackRef.current.scrollLeft + slideTrackRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  // expaned group
  useEffect(() => {
    const handleResize = () => {
      setIsMedium(window.innerWidth >= 768)
    }
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={`relative ${className}`} id={bestSeller ? 'best-seller' : category?.slug}>
      {/* MARK: Next - Previous */}
      {!isExpaned && (
        <>
          <button
            className='group flex items-center justify-center absolute -left-21 top-1/2 -translate-y-1/2 bg-secondary bg-opacity-80 w-11 h-11 z-10 rounded-full shadow-md trans-200 hover:bg-opacity-100 group'
            onClick={prevSlide}>
            <FaChevronLeft size={18} className='wiggle text-white' />
          </button>
          <button
            className='group flex items-center justify-center absolute -right-21 top-1/2 -translate-y-1/2 bg-secondary bg-opacity-80 w-11 h-11 z-10 rounded-full shadow-md trans-200 hover:bg-opacity-100 group'
            onClick={nextSlide}>
            <FaChevronRight size={18} className='wiggle text-white' />
          </button>
        </>
      )}

      {/* MARK: Slider */}
      <div className='flex flex-wrap'>
        <div
          className={`flex items-start ${
            isExpaned ? 'flex-wrap gap-y-21' : ''
          } w-full py-21 overflow-x-auto ${!isDragging ? 'snap-x snap-mandatory' : ''}`}
          ref={slideTrackRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseMove={handleDraging}
          onMouseUp={() => setIsDragging(false)}>
          {(child === 'course-card' ? courses : questions).map((item: any, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 ${!isDragging ? 'snap-start' : ''} ${childClassName}`}>
              {child === 'course-card' ? (
                <CourseCard course={item.course} className='' />
              ) : (
                <Question question={item} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GroupCourses
