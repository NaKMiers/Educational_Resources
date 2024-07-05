'use client'

import { handleQuery } from '@/utils/handleQuery'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

interface PaginationProps {
  searchParams: { [key: string]: string[] | string } | undefined
  amount: number
  itemsPerPage: number
  dark?: boolean
  className?: string
}

function Pagination({
  searchParams = {},
  amount = 0,
  itemsPerPage = 9, // default item/page
  dark,
  className = '',
}: PaginationProps) {
  // hooks
  const pathname = usePathname()
  const router = useRouter()
  const queryParams = useSearchParams()
  const page = queryParams.get('page')

  // values
  const pageAmount = Math.ceil(amount / itemsPerPage) // calculate page amount
  const currentPage = page ? +page : 1

  // set page link
  const getPageLink = useCallback(
    (value: number) => {
      // get page from searchParams
      const params = { ...searchParams }
      if (params.page) {
        delete params.page
      }
      params.page = [value.toString()]

      return pathname + handleQuery(params)
    },
    [searchParams, pathname]
  )

  // keyboard event
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // left arrow
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        router.push(getPageLink(currentPage - 1))
      }

      // right arrow
      if (e.key === 'ArrowRight' && currentPage < pageAmount) {
        router.push(getPageLink(currentPage + 1))
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [currentPage, pageAmount, router, getPageLink])

  return (
    pageAmount > 1 && (
      <div
        className={`flex font-semibold gap-2 justify-center w-full max-w-[491px] mx-auto ${className}`}
      >
        {/* MARK: Prev */}
        {currentPage != 1 && (
          <Link
            href={getPageLink(currentPage <= 1 ? 1 : currentPage - 1)}
            className='rounded-lg border-2 py-[6px] px-2 bg-white hover:bg-secondary hover:border-secondary text-dark hover:text-white trans-200 border-slate-200'
            title={`👈 Trang ${currentPage <= 1 ? 1 : currentPage - 1}`}
          >
            Trước
          </Link>
        )}

        {/* MARK: 1 ... n */}
        <div className='flex gap-2 no-scrollbar overflow-x-scroll'>
          {Array.from({ length: pageAmount }).map((_, index) => (
            <Link
              href={getPageLink(index + 1)}
              className={`rounded-lg border-2 py-[6px] px-4 hover:bg-secondary hover:border-secondary hover:text-white trans-200 ${
                dark ? 'text-white' : 'text-dark'
              } ${currentPage === index + 1 ? 'bg-primary border-primary' : 'border-slate-200'}`}
              key={index}
            >
              {index + 1}
            </Link>
          ))}
        </div>

        {/* MARK: Next */}
        {currentPage != pageAmount && (
          <Link
            href={getPageLink(currentPage >= pageAmount ? pageAmount : currentPage + 1)}
            className='rounded-lg border-2 py-[6px] px-2 bg-white hover:bg-secondary hover:border-secondary text-dark hover:text-white trans-200 border-slate-200'
            title={`👉 Trang ${currentPage >= pageAmount ? pageAmount : currentPage + 1}`}
          >
            Sau
          </Link>
        )}
      </div>
    )
  )
}

export default Pagination
