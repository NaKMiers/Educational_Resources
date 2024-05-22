'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaBoltLightning } from 'react-icons/fa6'

interface ContactFloatingProps {
  className?: string
}

function FloatingButton({ className = '' }: ContactFloatingProps) {
  // states
  const [open, setOpen] = useState<boolean>(false)

  // key board event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // clean up
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen])

  return (
    <div
      className={`fixed z-30 right-3 bottom-[80px] bg-dark-100 flex items-center rounded-xl trans-300 overflow-hidden shadow-medium-light select-none ${className}`}>
      <Link
        href='/flash-sale'
        className='group flex items-center justify-center h-[44px] w-[44px]'
        onClick={() => setOpen(!open)}>
        <FaBoltLightning size={20} className={`text-white wiggle trans-200`} />
      </Link>
    </div>
  )
}

export default FloatingButton
