'use client'

import { useEffect, useRef } from 'react'

interface CounterItem {
  max: number
  value: number
  size?: number
  className?: string
}

function CounterItem({ max, value, size = 25, className }: CounterItem) {
  // refs
  const slideTrackRef = useRef<HTMLDivElement>(null)

  // change slide main function
  useEffect(() => {
    if (slideTrackRef.current) {
      let slide = max - value

      if (slide === 0) {
        slideTrackRef.current.style.marginTop = `calc(-${size}px * ${max + 1})`

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'none'
            slideTrackRef.current.style.marginTop = `calc(-${size}px * ${0})`
          }
        }, 210)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'all 0.2s linear'
          }
        }, 250)
      } else {
        slideTrackRef.current.style.marginTop = `calc(-${size}px * ${slide})`
      }
    }
  }, [max, value, size])

  return (
    <div className={`overflow-y-hidden ${className}`} style={{ height: size }}>
      <div className={`flex flex-col h-full common-transition`} ref={slideTrackRef}>
        {[...Array.from({ length: max + 1 }, (_, i) => max - i), max].map((n, i) => (
          <span className='flex-shrink-0 h-full' key={i}>
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

export default CounterItem
