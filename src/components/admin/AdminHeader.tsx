import Link from 'next/link'
import { FaArrowLeft, FaPlus } from 'react-icons/fa'

interface AdminHeaderProps {
  title: string
  addLink?: string
  backLink?: string
  className?: string
}

function AdminHeader({ title, addLink, backLink, className = '' }: AdminHeaderProps) {
  return (
    <div className={`flex flex-wrap text-sm justify-center items-end mb-3 gap-3 ${className}`}>
      <Link
        className='flex items-center gap-1 text-dark bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
        href='/admin'>
        <FaArrowLeft />
        Admin
      </Link>

      <div className='py-2 px-3 text-white border border-slate-300 rounded-lg text-lg text-center'>
        {title}
      </div>

      {backLink && (
        <Link
          href={backLink}
          className='flex items-center gap-1 bg-slate-200 text-dark py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'>
          <FaArrowLeft />
          Back
        </Link>
      )}

      {addLink && (
        <Link
          href={addLink}
          className='flex items-center gap-1 bg-slate-200 text-dark py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'>
          <FaPlus />
          Add
        </Link>
      )}
    </div>
  )
}

export default AdminHeader
