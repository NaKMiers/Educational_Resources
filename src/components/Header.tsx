'use client'

import { useAppDispatch } from '@/libs/hooks'
import { searchCoursesApi } from '@/requests'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaBell, FaHome, FaSearch } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa6'
import { MdForum } from 'react-icons/md'
import { PiLightningFill } from 'react-icons/pi'
import { RiDonutChartFill } from 'react-icons/ri'
import { SiCoursera } from 'react-icons/si'
import Menu from './Menu'

interface HeaderProps {
  isStatic?: boolean
}

function Header({ isStatic }: HeaderProps) {
  // hooks
  const dispatch = useAppDispatch()
  const { data: session, update } = useSession()

  // states
  const [curUser, setCurUser] = useState<any>(session?.user || {})
  const [isShow, setIsShow] = useState<boolean>(true)
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const lastScrollTop = useRef<number>(0)

  // search
  const [openSearch, setOpenSearch] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<any[] | null>(null)
  const searchTimeout = useRef<any>(null)
  const [enableHideHeader, setEnableHideHeader] = useState<boolean>(true)
  const [openResults, setOpenResults] = useState<boolean>(false)

  // MARK: Side Effects
  // update user session
  useEffect(() => {
    const getUser = async () => {
      const session = await getSession()
      setCurUser(session?.user)
      await update()
    }

    if (!curUser?._id) {
      getUser()
    }
  }, [update, curUser])

  // // show and hide header on scroll
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (enableHideHeader) {
  //       let scrollTop = window.scrollY

  //       // scroll down
  //       if (scrollTop >= 21) {
  //         // scroll top
  //         if (scrollTop > lastScrollTop.current) {
  //           setIsShow(true)
  //         } else {
  //           setIsShow(false)
  //           setIsOpenMenu(false)
  //         }

  //         lastScrollTop.current = scrollTop
  //       } else {
  //         setIsShow(false)
  //         setIsOpenMenu(false)
  //       }
  //     }
  //   }

  //   window.addEventListener('scroll', handleScroll)
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // })

  // handle search
  const handleSearch = useCallback(async () => {
    // start loading
    setSearchLoading(true)

    try {
      // send request to search courses
      const { courses } = await searchCoursesApi(searchValue)

      // set search results
      setSearchResults(courses)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setSearchLoading(false)
    }
  }, [searchValue])

  // auto search after 0.5s when search value changes
  useEffect(() => {
    if (searchValue) {
      clearTimeout(searchTimeout.current)
      searchTimeout.current = setTimeout(() => {
        handleSearch()
      }, 500)
    } else {
      setSearchResults(null)
      setEnableHideHeader(true)
    }
  }, [searchValue, handleSearch])

  return (
    <header
      className={`${
        isStatic ? 'static' : 'fixed z-50'
      } bg-white w-full text-dark shadow-lg transition-all duration-300 ${
        isShow ? 'bottom-0 md:bottom-auto md:top-0' : '-bottom-full md:bottom-auto md:-top-full'
      }`}>
      {/* Main Header */}
      <div className='relative flex justify-between items-center max-w-1200 w-full h-[72px] m-auto px-21'>
        {/* MARK: Brand */}
        <div
          className={`${
            openSearch ? 'max-w-0 overflow-hidden' : 'max-w-[100px] w-full'
          } hidden sm:flex sm:flex-shrink-0 pl-4 -ml-4 items-center h-full overflow-x-scroll no-scrollbar duration-300 transition-all`}>
          <Link href='/' prefetch={false} className='shrink-0 trans-200 spin mr-2'>
            <Image
              className='aspect-square rounded-md'
              src='/images/logo.png'
              width={30}
              height={30}
              alt='logo'
            />
          </Link>
          <Link href='/' prefetch={false} className='text-2xl font-bold'>
            ERE
          </Link>
        </div>

        {/* Search */}
        <div
          className={`flex items-center ${
            openSearch ? 'max-w-full' : 'max-w-[500px]'
          } w-full lg:min-w-[520px] duration-300 transition-all`}>
          <div
            className={`${
              openSearch
                ? 'max-w-0 w-0 overflow-hidden mr-0'
                : 'max-w-[114px] md:max-w-[200px] w-full mr-21'
            } flex items-center gap-21 duration-300 transition-all`}>
            <Link
              href='/'
              className='font-semibold hover:text-sky-400 underline-offset-2 trans-200 relative after:absolute after:-bottom-0.5 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-sky-400 after:transition-all after:duration-300'>
              <span className='hidden md:block'>Home</span>
              <FaHome size={24} className='md:hidden' />
            </Link>
            <Link
              href='/courses'
              className='font-semibold hover:text-sky-400 underline-offset-2 trans-200 relative after:absolute after:-bottom-0.5 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-sky-400 after:transition-all after:duration-300'>
              <span className='hidden md:block'>Course</span>
              <SiCoursera size={24} className='md:hidden' />
            </Link>
            <Link
              href='/question'
              className='font-semibold hover:text-sky-400 underline-offset-2 trans-200 relative after:absolute after:-bottom-0.5 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-sky-400 after:transition-all after:duration-300'>
              <span className='hidden md:block'>Forum</span>
              <MdForum size={24} className='md:hidden' />
            </Link>
          </div>

          <div
            className={`${
              !searchResults ? 'overflow-hidden' : ''
            } w-full border border-dark rounded-[24px] relative mr-2.5 h-[36px] flex items-center justify-center text-dark`}>
            <input
              type='text'
              placeholder='Search...'
              className='appearance-none w-full h-full font-body tracking-wider px-4 py-2 outline-none rounded-0 rounded-l-lg bg-white'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onFocus={() => {
                setEnableHideHeader(false)
                setOpenResults(true)

                setOpenSearch(true)
                // setEnableHideHeader(true)
              }}
              onBlur={() => {
                setEnableHideHeader(true)
                setOpenResults(false)
                setOpenSearch(false)
              }}
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

            <ul
              className={`${
                searchResults && openResults ? 'max-h-[500px] p-2' : 'max-h-0 p-0'
              } absolute z-20 bottom-12 lg:bottom-auto lg:top-12 left-0 w-full rounded-lg shadow-medium bg-slate-200 bg-opacity-75 gap-2 overflow-y-auto transition-all duration-300`}>
              {searchResults?.length ? (
                searchResults.map(course => (
                  <Link
                    href={`/${course.slug}`}
                    key={course._id}
                    className='flex gap-4 py-2 items-start rounded-lg p-2 hover:bg-sky-200 trans-200'>
                    <div className='relative aspect-video flex-shrink-0'>
                      {course.stock <= 0 && (
                        <div className='absolute top-0 left-0 right-0 flex justify-center items-start aspect-video bg-white rounded-lg bg-opacity-50'>
                          <Image
                            className='animate-wiggle -mt-1'
                            src='/images/sold-out.jpg'
                            width={28}
                            height={28}
                            alt='sold-out'
                          />
                        </div>
                      )}
                      <Image
                        className='rounded-md'
                        src={course.images[0]}
                        width={70}
                        height={70}
                        alt='course'
                      />

                      {course.flashSale && (
                        <PiLightningFill
                          className='absolute -top-1.5 left-1 text-yellow-400 animate-bounce'
                          size={16}
                        />
                      )}
                    </div>

                    <p className='w-full text-ellipsis line-clamp-2 text-dark font-body text-sm tracking-wide leading-5 -mt-0.5'>
                      {course.title}
                    </p>
                  </Link>
                ))
              ) : (
                <p className='text-sm text-center'>0 kết quả tìm thấy</p>
              )}
            </ul>
          </div>
        </div>

        {/* MARK: Nav */}
        <div className='flex-shrink-0 hidden md:flex items-center gap-4'>
          {curUser ? (
            !!curUser._id && (
              <>
                <button className='group'>
                  <FaBell size={24} className='wiggle' />
                </button>
                <div
                  className='flex items-center gap-2 cursor-pointer'
                  onClick={() => setIsOpenMenu(prev => !prev)}>
                  <Image
                    className='aspect-square rounded-full wiggle-0'
                    src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                    width={40}
                    height={40}
                    alt='avatar'
                  />

                  <span className='font-semibold text-lg'>
                    {curUser?.firstName && curUser?.lastName
                      ? `${curUser.firstName} ${curUser.lastName}`
                      : curUser.username}
                  </span>
                </div>
              </>
            )
          ) : (
            <div className='flex items-center gap-3'>
              <Link
                href='/auth/login'
                className='bg-[#019CDE] text-white hover:bg-white hover:text-dark border border-dark text-nowrap trans-200 px-4 py-1.5 rounded-3xl font-body font-semibold tracking-wider cursor-pointer'>
                Sign In
              </Link>
              <Link
                href='/auth/register'
                className='bg-[#001D4F] text-[#019CDE] hover:bg-white hover:text-dark border border-dark text-nowrap trans-200 px-4 py-1.5 rounded-3xl font-body font-semibold tracking-wider cursor-pointer'>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Menu Button */}
        <div className='md:hidden flex items-center gap-0.5'>
          <button className='group'>
            <FaBell size={22} className='wiggle' />
          </button>
          <button
            className='flex justify-center items-center w-[40px] h-[40px]'
            onClick={() => setIsOpenMenu(prev => !prev)}>
            <FaBars size={22} className='trans-200 wiggle' />
          </button>
        </div>

        {/* MARK: Menu */}
        <Menu open={isOpenMenu} setOpen={setIsOpenMenu} />
      </div>
    </header>
  )
}

export default Header
