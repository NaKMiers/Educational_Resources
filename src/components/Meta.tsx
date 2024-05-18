'use client'

import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FaSearch } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

interface MetaProps {
  title?: string
  searchParams: { [key: string]: string[] | string } | undefined
  // type: 'tag' | 'ctg' | 'flash-sale' | 'best-seller' | 'search'
  categories?: ICategory[]
  tags?: ITag[]
  chops?: { [key: string]: number } | null
  hideSearch?: boolean
  hidePrice?: boolean
  hideStock?: boolean
  className?: string
}

function Meta({
  title,
  searchParams,
  categories = [],
  tags = [],
  chops,
  hidePrice,
  hideStock,
  hideSearch,
  className = '',
}: MetaProps) {
  // hooks
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [selectedFilterCategories, setSelectedFilterCategories] = useState<string[]>(
    [].concat((searchParams?.ctg || categories.map(category => category.slug)) as []).map(type => type)
  )
  // states
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>(
    [].concat((searchParams?.tag || tags.map(tag => tag.slug)) as []).map(type => type)
  )
  const [search, setSearch] = useState<string>(searchParams?.search as string)
  const [openFilterCategory, setOpenFilterCategory] = useState<boolean>(false)
  const [openFilterTag, setOpenFilterTag] = useState<boolean>(false)

  // refs
  const timeoutCtg = useRef<any>(null)
  const timeoutTg = useRef<any>(null)

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'updatedAt|-1',
    }),
    []
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues,
  })

  // sync search params with states
  useEffect(() => {
    // sync search params with states
    setValue('search', searchParams?.search || getValues('search'))
    setValue('sort', searchParams?.sort || getValues('sort'))
  }, [getValues, searchParams, setValue])

  // MARK: Handlers
  // handle opimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    ({ data, newSelectedCates, newSelectedTgs }) => {
      newSelectedCates = newSelectedCates || []
      newSelectedTgs = newSelectedTgs || []

      // reset page
      if (searchParams?.page) {
        delete searchParams.page
      }

      // loop through data to prevent filter default
      for (let key in data) {
        if (data[key] === defaultValues[key]) {
          if (!searchParams?.[key]) {
            delete data[key]
          } else {
            data[key] = ''
          }
        }
      }

      return {
        ...data,
        search: search || '',
        ctg: newSelectedCates.length === categories.length ? [] : newSelectedCates,
        tag: newSelectedTgs.length === tags.length ? [] : newSelectedTgs,
      }
    },
    [categories.length, tags.length, searchParams, defaultValues, search]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async ({ data, newSelectedCates, newSelectedTgs }) => {
      console.log('Filtering...', newSelectedCates)

      const params: any = handleOptimizeFilter({ data, newSelectedCates, newSelectedTgs })

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...params,
      })
      // push to router
      router.push(pathname + query)
    },
    [handleOptimizeFilter, router, searchParams, pathname]
  )

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset()
    router.push(pathname)
  }, [reset, router, pathname])

  // handle select filter item
  const handleSelectFilterCategory = useCallback(
    (item: string) => {
      clearTimeout(timeoutCtg.current)
      const newSelectedCates = selectedFilterCategories.includes(item)
        ? selectedFilterCategories.filter(id => id !== item)
        : [...selectedFilterCategories, item]

      setSelectedFilterCategories(newSelectedCates)

      timeoutCtg.current = setTimeout(() => {
        handleSubmit(data => handleFilter({ data, newSelectedCates }))()
      }, 500)
    },
    [setSelectedFilterCategories, handleSubmit, handleFilter, selectedFilterCategories]
  )

  // handle select filter item
  const handleSelectFilterTag = useCallback(
    (item: string) => {
      clearTimeout(timeoutTg.current)
      const newSelectedTgs = selectedFilterTags.includes(item)
        ? selectedFilterTags.filter(id => id !== item)
        : [...selectedFilterTags, item]

      setSelectedFilterTags(newSelectedTgs)

      timeoutTg.current = setTimeout(() => {
        handleSubmit(data => handleFilter({ data, newSelectedTgs }))()
      }, 500)
    },
    [setSelectedFilterTags, handleSubmit, handleFilter, selectedFilterTags]
  )

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + F (Filter)
      if (e.altKey && e.key === 'f') {
        e.preventDefault()
        handleSubmit(handleFilter)()
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
  }, [handleFilter, handleResetFilter, handleSubmit])

  return (
    <div
      className={`self-end w-full text-dark transition-all duration-300 no-scrollbar p-21 ${className}`}>
      {/* MARK: Filter */}
      <div className='relative grid grid-cols-12 gap-21'>
        {/* MARK: Categories Selection */}
        <div className='flex gap-1 flex-wrap max-h-[110px] overflow-auto col-span-12 md:col-span-4 order-2 md:order-1'>
          <div
            className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none trans-200 ${
              openFilterCategory
                ? 'bg-dark-100 text-white border-dark-100'
                : 'border-slate-300 bg-slate-200'
            }`}
            title='Filter'
            onClick={() => setOpenFilterCategory(true)}>
            Filter Categories
          </div>
          {selectedFilterCategories.length !== categories.length &&
            categories
              .filter(item => selectedFilterCategories.includes(item.slug))
              .map(item => (
                <div
                  className={`group flex items-center justify-center gap-1 overflow-hidden text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none trans-200 ${
                    selectedFilterCategories.includes(item.slug)
                      ? 'bg-secondary text-white border-secondary'
                      : 'border-slate-300'
                  }`}
                  title={item.title}
                  key={item.slug}
                  onClick={() => handleSelectFilterCategory(item.slug)}>
                  {item.title}
                  <IoMdClose size={16} className='wiggle' />
                </div>
              ))}

          {/* MARK: Overlay */}
          <div
            className={`${
              openFilterCategory ? 'block' : 'hidden'
            } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30 ${className}`}
            onClick={() => setOpenFilterCategory(false)}
          />

          {/* MARK: Main */}
          <ul
            className={`${
              openFilterCategory
                ? 'max-h-[200px] max-w-[500px] w-full p-3 opacity-1 overflow-auto'
                : 'max-w-0 max-h-0 overflow-hidden p-0 opacity-0'
            } flex flex-wrap gap-1 transition-all duration-300 absolute top-9 left-0 z-30 rounded-lg shadow-md bg-slate-100`}>
            <li
              className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none trans-200 ${
                categories.length === selectedFilterCategories.length
                  ? 'bg-dark-100 text-white border-dark-100'
                  : 'border-slate-300 bg-slate-200'
              }`}
              title='All Types'
              onClick={() => {
                setSelectedFilterCategories(
                  categories.length === selectedFilterCategories.length
                    ? []
                    : categories.map(tag => tag.slug)
                )
                handleSubmit(data =>
                  handleFilter({
                    data,
                    newSelectedCates:
                      categories.length === selectedFilterCategories.length
                        ? []
                        : categories.map(tag => tag.slug),
                  })
                )()
              }}>
              All
            </li>
            {categories.map(item => (
              <li
                className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none trans-200 ${
                  selectedFilterCategories.includes(item.slug)
                    ? 'bg-secondary text-white border-secondary'
                    : 'border-slate-300'
                }`}
                title={item.title}
                key={item.slug}
                onClick={() => handleSelectFilterCategory(item.slug)}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* MARK: Tags Selection */}
        <div className='flex gap-1 flex-wrap max-h-[110px] overflow-auto col-span-12 md:col-span-4 order-2 md:order-1'>
          <div
            className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none trans-200 ${
              openFilterTag ? 'bg-dark-100 text-white border-dark-100' : 'border-slate-300 bg-slate-200'
            }`}
            title='Filter'
            onClick={() => setOpenFilterTag(true)}>
            Filter Tags
          </div>
          {selectedFilterTags.length !== tags.length &&
            tags
              .filter(item => selectedFilterTags.includes(item.slug))
              .map(item => (
                <div
                  className={`group flex items-center justify-center gap-1 overflow-hidden text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none trans-200 ${
                    selectedFilterTags.includes(item.slug)
                      ? 'bg-secondary text-white border-secondary'
                      : 'border-slate-300'
                  }`}
                  title={item.title}
                  key={item.slug}
                  onClick={() => handleSelectFilterTag(item.slug)}>
                  {item.title}
                  <IoMdClose size={16} className='wiggle' />
                </div>
              ))}

          {/* MARK: Overlay */}
          <div
            className={`${
              openFilterTag ? 'block' : 'hidden'
            } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30 ${className}`}
            onClick={() => setOpenFilterTag(false)}
          />

          {/* MARK: Main */}
          <ul
            className={`${
              openFilterTag
                ? 'max-h-[200px] max-w-[500px] w-full p-3 opacity-1 overflow-auto'
                : 'max-w-0 max-h-0 overflow-hidden p-0 opacity-0'
            } flex flex-wrap gap-1 transition-all duration-300 absolute top-9 left-1/3 z-30 rounded-lg shadow-md bg-slate-100`}>
            <li
              className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none trans-200 ${
                tags.length === selectedFilterTags.length
                  ? 'bg-dark-100 text-white border-dark-100'
                  : 'border-slate-300 bg-slate-200'
              }`}
              title='All Types'
              onClick={() => {
                setSelectedFilterTags(
                  tags.length === selectedFilterTags.length ? [] : tags.map(tag => tag.slug)
                )
                handleSubmit(data =>
                  handleFilter({
                    data,
                    newSelectedTgs:
                      tags.length === selectedFilterTags.length ? [] : tags.map(tag => tag.slug),
                  })
                )()
              }}>
              All
            </li>
            {tags.map(item => (
              <li
                className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none trans-200 ${
                  selectedFilterTags.includes(item.slug)
                    ? 'bg-secondary text-white border-secondary'
                    : 'border-slate-300'
                }`}
                title={item.title}
                key={item.slug}
                onClick={() => handleSelectFilterTag(item.slug)}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Search */}
        <div className='flex flex-col col-span-12 md:col-span-4 order-1 md:order-2'>
          <div className={`${className}`} onFocus={() => clearErrors('search')}>
            <div
              className={`flex border ${
                errors['search'] ? 'border-rose-500' : 'border-dark'
              } rounded-[16px]`}>
              {/* MARK: Icon */}
              <span
                className={`inline-flex items-center px-3 rounded-l-[16px] text-sm text-gray-900 ${
                  errors.search ? 'border-rose-400 bg-rose-100' : 'border-slate-200 bg-slate-100'
                } cursor-pointer`}>
                <FaSearch size={19} className='text-secondary' />
              </span>

              {/* MARK: Text Field */}
              <div
                className={`relative w-full border-l-0 rounded-r-[16px]'} ${
                  errors['search'] ? 'border-rose-400' : 'border-slate-200'
                }`}>
                <input
                  id={'search'}
                  className='block h-[42px] px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer number-input'
                  disabled={false}
                  type='text'
                  onChange={e => setSearch(e.target.value)}
                  placeholder=''
                />

                {/* MARK: Label */}
                <label
                  htmlFor={'search'}
                  className={`absolute text-nowrap rounded-md text-sm text-dark duration-300 transform -translate-y-4 scale-75 top-2 left-5 z-10 origin-[0] font-semibold bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-[48%] peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer ${
                    errors.search ? 'text-rose-400' : 'text-dark'
                  }`}>
                  Search
                </label>
              </div>
            </div>

            {/* MARK: Error */}
            {errors.search?.message && (
              <span className='text-sm drop-shadow-md text-rose-400'>
                {errors.search?.message?.toString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Meta
