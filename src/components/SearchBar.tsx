'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'

function SearchBar() {
  // hooks

  // states
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  return (
    <div className={`flex items-center max-w-[500px] w-full lg:min-w-[520px] trans-300`}>
      <div
        className={`w-full border border-dark rounded-[24px] relative mr-2.5 h-[36px] flex items-center justify-center text-dark`}>
        <input
          type='text'
          placeholder='Search...'
          className='appearance-none w-full h-full font-body tracking-wider px-4 py-2 outline-none rounded-0 rounded-l-lg bg-white'
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <Link
          href={`/search?search=${searchValue}`}
          onClick={e => !searchValue && e.preventDefault()}
          className={`group h-full w-[40px] flex justify-center items-center rounded-r-lg bg-white ${
            searchLoading ? 'pointer-events-none' : ''
          }`}>
          {searchLoading ? (
            <RiDonutChartFill size={20} className='animate-spin text-slate-300' />
          ) : (
            <FaSearch size={16} className='wiggle' />
          )}
        </Link>
      </div>
    </div>
  )
}

export default SearchBar
