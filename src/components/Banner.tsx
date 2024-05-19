'use client'

import Image from 'next/image'
import React, { useCallback, useRef } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const data = ['/banners/img1.jpg', '/banners/img2.jpg', '/banners/img3.jpg', '/banners/img4.jpg']

function Banner() {
  // hooks

  // states

  // ref
  const carouselRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const timeout = useRef<any>(null)

  // values
  const time = 2000

  // methods
  const handleSlide = useCallback((type: 'prev' | 'next') => {
    if (!carouselRef.current || !listRef.current || !thumbnailsRef.current) return
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

  return (
    <div className='carousel relative w-full h-[calc(100vh-72px)] overflow-hidden' ref={carouselRef}>
      {/* List Items */}
      <div className='list' ref={listRef}>
        {data.map((item, index) => (
          <div className='item absolute inset-0 ' key={item}>
            <Image
              className='img w-full h-full object-cover'
              src={item}
              width={1920}
              height={1080}
              alt='item'
            />
            <div className='content absolute top-[10%] md:top-[20%] left-1/2 -translate-x-1/2 max-w-[80%] w-[1140px] md:pr-[30%] drop-shadow-lg text-white'>
              <div className='author font-bold tracking-[10px]'>NAKMIERS</div>
              <div className='title font-bold text-[30px] md:text-[5em] leading-[1.3em] delay-[1.2s]'>
                Full Stack Developer
              </div>
              <div className='topic font-bold text-[30px] md:text-[5em] leading-[1.3em] text-[#f1683a] delay-[1.4s]'>
                Animal {index + 1}
              </div>
              <div className='desc delay-[1.6s]'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi minima repellat quia
                numquam expedita. Dolorem quisquam eos at ratione consequatur.
              </div>
              <div className='buttons flex flex-wrap gap-1.5 mt-5 delay-[1.8s]'>
                <button className='h-10 px-2 text-dark bg-slate-100 font-semibold font-body tracking-wider rounded-sm hover:bg-dark-0 hover:text-slate-200 trans-200'>
                  SEE MORE
                </button>
                <button className='h-10 px-2 text-slate-200 border-2 border-slate-200 font-semibold font-body tracking-wider rounded-sm hover:bg-slate-200 hover:text-dark trans-200'>
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      <div
        className='thumbnails absolute bottom-[50px] left-1/2 z-10 flex gap-21 text-white'
        ref={thumbnailsRef}>
        {[...data.slice(1), data[0]].map(item => (
          <div className='item relative w-[150px] h-[220px] flex-shrink-0' key={item}>
            <Image
              className='img w-full h-full object-cover rounded-medium'
              src={item}
              width={300}
              height={300}
              alt='item'
            />
            <div className='content absolute bottom-2.5 left-2.5 right-2.5'>
              <div className='title font-semibold'>Name Slider</div>
              <div className='description'>Description</div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <div className='arrows absolute bottom-[50px] left-[10%] md:left-1/3 flex gap-2.5'>
        <button
          className='prev flex items-center justify-center w-10 h-10 rounded-full text-white bg-slate-500 bg-opacity-50 border-0 z-10 hover:bg-white hover:text-dark trans-200'
          onClick={prevSlide}>
          <FaChevronLeft size={16} />
        </button>
        <button
          className='next flex items-center justify-center w-10 h-10 rounded-full text-white bg-slate-500 bg-opacity-50 border-0 z-10 hover:bg-white hover:text-dark trans-200'
          onClick={nextSlide}>
          <FaChevronRight size={16} />
        </button>
      </div>

      {/* Duration */}
      <div className='time w-0 h-1 bg-[#f1683a] absolute top-0 left-0 z-10' />
    </div>
  )
}

export default Banner
