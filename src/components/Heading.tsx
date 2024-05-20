import React from 'react'

interface HeadingProps {
  title: string
  noLine?: boolean
  className?: string
}

function Heading({ title, noLine, className }: HeadingProps) {
  return (
    <div
      className={`relative max-w-1200 mx-auto w-full ${noLine ? 'h-0' : 'h-0.5'} bg-dark-0 rounded-lg`}>
      <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold bg-white px-4 py-1 rounded-lg'>
        {title}
      </span>
    </div>
  )
}

export default Heading
