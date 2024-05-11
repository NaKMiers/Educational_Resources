'use client'

import Image from 'next/image'
import React, { Children, useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface SliderProps {
  time?: number
  children: React.ReactNode
  className?: string
  hideControls?: boolean
  thumbs?: string[]
  mobile?: boolean
}

function Slider({ time, hideControls, children, thumbs = [], mobile, className = '' }: SliderProps) {
  // states
  const [slide, setSlide] = useState<number>(1)
  const [isSliding, setIsSliding] = useState<boolean>(false)
  const [touchStartX, setTouchStartX] = useState<number>(0)
  const [touchEndX, setTouchEndX] = useState<number>(0)

  // refs
  const slideTrackRef = useRef<HTMLDivElement>(null)

  // values
  const childrenAmount = Children.count(children)

  // MARK: Slide Functions
  // change slide main function
  useEffect(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.style.marginLeft = `calc(-100% * ${slide})`
    }
  }, [slide])

  // to next slide
  const nextSlide = useCallback(() => {
    // not sliding
    if (!isSliding) {
      // start sliding
      setIsSliding(true)

      if (slide === childrenAmount) {
        setSlide(childrenAmount + 1)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'none'
            setSlide(1)
          }
        }, 310)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'all 0.3s linear'
          }
        }, 350)
      } else {
        setSlide(prev => prev + 1)
      }

      // stop sliding after slided
      setTimeout(() => {
        setIsSliding(false)
      }, 350)
    }
  }, [childrenAmount, isSliding, slide])

  // to previous slide
  const prevSlide = useCallback(() => {
    // if not sliding
    if (!isSliding) {
      // start sliding
      setIsSliding(true)

      if (slide === 1) {
        setSlide(0)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'none'
            setSlide(childrenAmount)
          }
        }, 310)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'all 0.3s linear'
          }
        }, 350)
      } else {
        setSlide(prev => prev - 1)
      }

      // stop sliding after slided
      setTimeout(() => {
        setIsSliding(false)
      }, 350)
    }
  }, [childrenAmount, isSliding, slide])

  // next slide by time
  useEffect(() => {
    if (time) {
      const interval = setInterval(() => {
        nextSlide()
      }, time)

      return () => clearInterval(interval)
    }
  }, [time, nextSlide])

  // MARK: Touch Events
  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0].clientX)
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    setTouchEndX(event.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    const touchDiff = touchStartX - touchEndX
    if (touchDiff > 0 && touchDiff > 50) {
      nextSlide() // Swiped left
    } else if (touchDiff < 0 && touchDiff < -50) {
      prevSlide() // Swiped right
    }
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-lg group ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      {/* MARK: Slide Track */}
      <div
        className={`flex w-full h-full cursor-pointer no-scrollbar transition-all ease-linear duration-300`}
        style={{ marginLeft: '-100%' }}
        ref={slideTrackRef}>
        {[
          Children.toArray(children)[childrenAmount - 1],
          ...Children.toArray(children),
          Children.toArray(children)[0],
        ].map((child, index) => (
          <div key={index} className='w-full h-full shrink-0'>
            {child}
          </div>
        ))}
      </div>

      {/* MARK: Next - Previous */}
      {!hideControls && childrenAmount >= 2 && (
        <>
          <button
            className='group md:-translate-x-full group-hover:translate-x-0 absolute flex items-center justify-center hover:bg-slate-100 hover:bg-opacity-10 common-transition h-full w-12 left-0 top-0'
            onClick={prevSlide}>
            <FaChevronLeft size={16} className='wiggle text-white' />
          </button>
          <button
            className='group md:translate-x-full group-hover:translate-x-0 absolute flex items-center justify-center hover:bg-slate-100 hover:bg-opacity-10 common-transition h-full w-12 right-0 top-0'
            onClick={nextSlide}>
            <FaChevronRight size={16} className='wiggle text-white' />
          </button>
        </>
      )}

      {/* MARK: Indicators */}
      {thumbs.length >= 2 && (
        <div
          className={`absolute z-10 w-full px-21 ${
            mobile ? 'gap-6' : 'gap-5'
          } flex justify-center items-center left-1/2 -translate-x-1/2 bottom-[6%] md:translate-y-full md:bottom-0 group-hover:translate-y-0 group-hover:bottom-[6%] common-transition`}>
          {thumbs.map((src, index) => {
            return (
              <button
                className={`${
                  mobile ? 'aspect-[9/16]' : 'aspect-video'
                } rounded-lg shadow-md border-2 border-white common-transition hover:opacity-100 hover:scale-105 hover:-translate-y-1 overflow-hidden ${
                  slide === index + 1 ? 'opacity-100' : 'opacity-60'
                }`}
                onClick={() => setSlide(index + 1)}
                key={src}>
                <Image
                  className='w-full h-full object-cover'
                  src={src}
                  width={mobile ? 40 : 70}
                  height={mobile ? 70 : 40}
                  alt='slide-thumb'
                />
              </button>
            )
          })}
        </div>
      )}
      {childrenAmount >= 2 && thumbs.length <= 0 && (
        <div className='absolute z-10 flex items-center gap-5 left-1/2 -translate-x-1/2 bottom-[10%] md:translate-y-full  md:bottom-0 group-hover:translate-y-0 group-hover:bottom-[10%] common-transition'>
          {Array.from({ length: childrenAmount }).map((_, index) => {
            return (
              <button
                key={index}
                className={`w-[14px] h-[14px] rounded-full bg-white hover:bg-opacity-100 common-transition shadow-md ${
                  slide === index + 1 ? 'bg-opacity-100' : 'bg-opacity-50'
                }`}
                onClick={() => setSlide(index + 1)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Slider
