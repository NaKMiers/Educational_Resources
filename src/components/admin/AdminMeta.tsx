import React, { Children, useEffect } from 'react'
import { BiReset } from 'react-icons/bi'
import { FaFilter } from 'react-icons/fa'

interface AdminMetaProps {
  children: React.ReactNode
  handleFilter: () => void
  handleResetFilter: () => void
  className?: string
}

function AdminMeta({ handleFilter, handleResetFilter, className = '', children }: AdminMetaProps) {
  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + F (Filter)
      if (e.altKey && e.key === 'f') {
        e.preventDefault()
        handleFilter()
      }

      // Alt + R (Reset)
      if (e.altKey && e.key === 'r') {
        e.preventDefault()
        handleResetFilter()
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFilter, handleResetFilter])

  return (
    <div
      className={`mt-8 bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-full ${className}`}>
      <div className='grid grid-cols-12 gap-21'>
        {/* MARK: children 1 -> n - 1 */}
        {Children.toArray(children).slice(0, -1)}

        {/* MARK: Filter Buttons */}
        <div className='flex justify-end gap-2 items-center col-span-12 md:col-span-4'>
          {/* Filter Button */}
          <button
            className='group flex items-center text-nowrap bg-primary text-[16px] font-semibold py-2 px-3 rounded-md cursor-pointer hover:bg-secondary text-white common-transition'
            title='Alt + Enter'
            onClick={handleFilter}>
            Filter
            <FaFilter size={14} className='ml-[6px] wiggle' />
          </button>

          {/* Reset Button */}
          <button
            className='group flex items-center text-nowrap bg-slate-600 text-[16px] font-semibold py-2 px-3 rounded-md cursor-pointer hover:bg-slate-800 text-white common-transition'
            title='Alt + R'
            onClick={handleResetFilter}>
            Reset
            <BiReset size={22} className='ml-1 wiggle' />
          </button>
        </div>

        {/* MARK: children n */}
        {Children.toArray(children).slice(-1)}
      </div>
    </div>
  )
}

export default AdminMeta
