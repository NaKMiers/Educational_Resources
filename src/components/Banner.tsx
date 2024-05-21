'use client'

import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface BannerProps {
  courses: ICourse[]
  className?: string
}

function Banner({ courses, className = '' }: BannerProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  console.log('courses', courses)

  // states

  // ref
  const carouselRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const timeout = useRef<any>(null)
  const interval = useRef<any>(null)

  // values
  const time = 2000

  // methods
  const handleSlide = useCallback((type: 'prev' | 'next') => {
    if (!carouselRef.current || !listRef.current || !thumbnailsRef.current) return
    clearInterval(interval.current)
    const slideItems = listRef.current.children
    const thumbItems = thumbnailsRef.current.children

    if (type === 'next') {
      listRef.current?.appendChild(slideItems[0])
      thumbnailsRef.current?.appendChild(thumbItems[0])
      carouselRef.current?.classList.add('next')
    } else {
      listRef.current?.prepend(slideItems[slideItems.length - 1])
      thumbnailsRef.current?.prepend(thumbItems[thumbItems.length - 1])
      carouselRef.current?.classList.add('prev')
    }

    // timeout
    clearTimeout(timeout.current)
    setTimeout(() => {
      carouselRef.current?.classList.remove('prev')
      carouselRef.current?.classList.remove('next')
    }, time)
  }, [])

  const prevSlide = useCallback(() => {
    handleSlide('prev')
  }, [handleSlide])

  const nextSlide = useCallback(() => {
    handleSlide('next')
  }, [handleSlide])

  // auto slide
  useEffect(() => {
    setTimeout(() => {
      interval.current = setInterval(() => {
        nextSlide()
      }, time * 5)
    }, time * 2)
  }, [nextSlide])

  return (
    <div
      className={`carousel relative w-full h-[calc(100vh-72px)] overflow-hidden shadow-lg ${className}`}
      ref={carouselRef}>
      {/* List Items */}
      <div className='list' ref={listRef}>
        {courses.map((course, index) => (
          <div className='item absolute inset-0 ' key={course._id}>
            <Image
              className='img w-full h-full object-cover brightness-[0.8]'
              src={course.images[0]}
              width={1920}
              height={1080}
              alt='item'
            />
            <div className='content absolute top-[12%] left-1/2 -translate-x-1/2 max-w-[85%] w-[1140px] drop-shadow-2xl text-white'>
              <div className='author font-bold tracking-[10px] drop-shadow-lg uppercase'>
                {course.author}
              </div>
              <div
                className='title font-bold text-[30px] md:text-[5em] leading-[1.3em] drop-shadow-xl text-ellipsis line-clamp-1'
                title={course.title}>
                {course.title}
              </div>
              <div className='topic flex flex-wrap gap-x-2 gap-y-1 font-bold my-3'>
                {(course.categories as ICategory[]).map(category => (
                  <Link
                    href={`/courses?ctg=${category.slug}`}
                    className={`shadow-md text-xs ${
                      category.title ? 'bg-yellow-300 text-dark' : 'bg-slate-200 text-slate-400'
                    } px-2 py-px select-none rounded-md font-body`}
                    key={category._id}>
                    {category.title || 'empty'}
                  </Link>
                ))}
              </div>
              <div className='desc drop-shadow-md font-body tracking-wider pr-[20%] text-ellipsis line-clamp-4'>
                {course.description}
              </div>
              <div className='buttons flex flex-wrap gap-1.5 mt-5'>
                <Link
                  href={`/${course.slug}`}
                  className='h-10 flex items-center justify-center px-2 shadow-md text-dark bg-slate-100 font-semibold font-body tracking-wider rounded-md hover:bg-dark-0 hover:text-white trans-200'>
                  SEE MORE
                </Link>
                <Link
                  href={
                    curUser?._id &&
                    curUser?.courses.map((course: any) => course.course).includes(course._id)
                      ? `/learning/${course?._id}/continue`
                      : `/checkout/${course?.slug}`
                  }
                  className='h-10 flex items-center justify-center px-2 shadow-md text-white border-2 border-white font-semibold font-body tracking-wider rounded-md hover:bg-white hover:text-dark trans-200'>
                  {curUser?._id &&
                  curUser?.courses.map((course: any) => course.course).includes(course._id)
                    ? 'Continue Learning'
                    : 'Buy Now'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      {!!courses.length && (
        <div
          className='thumbnails absolute bottom-[50px] left-1/2 z-10 flex gap-21 text-white'
          ref={thumbnailsRef}>
          {[...courses.slice(1), courses[0]].map(course => (
            <div
              className='item relative w-[150px] h-[220px] flex-shrink-0 overflow-hidden rounded-medium'
              key={course._id}>
              <Image
                className='img w-full h-full object-cover'
                src={course.images[0]}
                width={300}
                height={300}
                alt='item'
              />
              <div className='content absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 px-3 py-1 text-sm rounded-t-lg text-dark'>
                <div className='title font-semibold'>{course.title}</div>
                <div className='description drop-shadow-lg'>{course.joined} students</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Arrows */}
      <div className='arrows absolute bottom-[50px] left-[10%] md:left-1/3 flex gap-4'>
        <button
          className='prev flex items-center justify-center w-12 h-12 rounded-full text-dark border border-dark bg-white shadow-lg z-10 hover:bg-dark-0 hover:text-white trans-200'
          onClick={prevSlide}>
          <FaChevronLeft size={16} />
        </button>
        <button
          className='next flex items-center justify-center w-12 h-12 rounded-full text-dark border border-dark bg-white shadow-lg z-10 hover:bg-dark-0 hover:text-white trans-200'
          onClick={nextSlide}>
          <FaChevronRight size={16} />
        </button>
      </div>

      {/* Duration */}
      <div className='time w-0 h-1 bg-sky-500 absolute top-0 left-0 z-10' />
    </div>
  )
}

export default Banner
