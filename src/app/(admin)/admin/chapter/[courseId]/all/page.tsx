'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IChapter } from '@/models/ChapterModel'
import {} from '@/requests'
import { getAllCourseChaptersApi } from '@/requests/chapterRequest'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { FaSearch, FaSort } from 'react-icons/fa'
import { MdOutlineFormatColorText } from 'react-icons/md'

function AllCourseChaptersPage({
  searchParams,
  params: { courseId },
}: {
  searchParams?: { [key: string]: string[] }
  params: { courseId: string }
}) {
  // hooks
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [chapters, setChapters] = useState<IChapter[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])

  // loading and confirming
  const [loadingChapters, setLoadingChapters] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  // const [minAccumulated, setMinAccumulated] = useState<number>(0)
  // const [maxAccumulated, setMaxAccumulated] = useState<number>(0)
  // const [accumulated, setAccumulated] = useState<number>(0)

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

  // MARK: Get Data
  // get all chapters
  useEffect(() => {
    // get all chapters
    const getAllChapters = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { chapters, amount, chops } = await getAllCourseChaptersApi(query) // cache: no-store

        console.log('chapters', chapters)

        // set to states
        setChapters(chapters)
        setAmount(amount)

        // sync search params with states
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))

        // // set accumulated
        // setMinAccumulated(chops.minAccumulated)
        // setMaxAccumulated(chops.maxAccumulated)
        // setAccumulated(searchParams?.accumulated ? +searchParams.accumulated : chops.maxAccumulated)
      } catch (err: any) {
        console.log(err)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllChapters()
  }, [dispatch, searchParams, setValue, getValues])

  // MARK: Handlers
  // delete chapter
  const handleDeleteChapters = useCallback(async (ids: string[]) => {
    setLoadingChapters(ids)

    try {
      // // senred request to server
      // const { deletedChapters, message } = await deleteChaptersApi(ids)
      // // remove deleted chapters from state
      // setChapters(prev =>
      //   prev.filter(
      //     chapter => !deletedChapters.map((chapter: IChapter) => chapter._id).includes(chapter._id)
      //   )
      // )
      // // show success message
      // toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingChapters([])
      setSelectedChapters([])
    }
  }, [])

  // handle select all chapters
  const handleSelectAllChapters = useCallback(() => {
    setSelectedChapters(
      selectedChapters.length > 0
        ? []
        : chapters.filter(chapter => chapter._id === 'chapter').map(chapter => chapter._id)
    )
  }, [chapters, selectedChapters.length])

  // handle opimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
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
        // accumulated: accumulated === maxAccumulated ? [] : [accumulated.toString()],
      }
    },
    [searchParams, defaultValues]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      const params: any = handleOptimizeFilter(data)

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

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        handleSelectAllChapters()
      }

      // Alt + Delete (Delete)
      if (e.altKey && e.key === 'Delete') {
        e.preventDefault()
        setIsOpenConfirmModal(true)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFilter, handleResetFilter, handleSelectAllChapters, handleSubmit])

  return (
    <div className='w-full'>
      {/* MARK: Top & Pagination */}
      <AdminHeader title='All Chapters' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* MARK: Filter */}
      <AdminMeta handleFilter={handleSubmit(handleFilter)} handleResetFilter={handleResetFilter}>
        {/* Search */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <Input
            id='search'
            className='md:max-w-[450px]'
            label='Search'
            disabled={false}
            register={register}
            errors={errors}
            type='text'
            icon={FaSearch}
            onFocus={() => clearErrors('search')}
          />
        </div>

        {/* MARK: Select Filter */}
        <div className='flex justify-end items-center flex-wrap gap-3 col-span-12 md:col-span-8'>
          {/* Select */}

          {/* Sort */}
          <Input
            id='sort'
            label='Sort'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('sort')}
            options={[
              {
                value: 'createdAt|-1',
                label: 'Newest',
              },
              {
                value: 'createdAt|1',
                label: 'Oldest',
              },
              {
                value: 'updatedAt|-1',
                label: 'Latest',
                selected: true,
              },
              {
                value: 'updatedAt|1',
                label: 'Earliest',
              },
            ]}
          />

          {/* role */}
          <Input
            id='role'
            label='Role'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('role')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'admin',
                label: 'Admin',
              },
              {
                value: 'editor',
                label: 'Editor',
              },
              {
                value: 'collaborator',
                label: 'Collaborator',
              },
              {
                value: 'chapter',
                label: 'Chapter',
              },
            ]}
          />
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-wrap justify-end items-center gap-2 col-span-12'>
          {/* Select All Button */}
          <button
            className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-white common-transition'
            onClick={handleSelectAllChapters}>
            {selectedChapters.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Delete Many Button */}
          {!!selectedChapters.length && (
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white common-transition'
              onClick={() => setIsOpenConfirmModal(true)}>
              Delete
            </button>
          )}
        </div>
      </AdminMeta>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Chapters'
        content='Are you sure that you want to delete these chapters?'
        onAccept={() => handleDeleteChapters(selectedChapters)}
        isLoading={loadingChapters.length > 0}
      />

      {/* MARK: Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} chapter{amount > 1 && 's'}
      </div>

      {/* Add Chapter Form */}
      <div className='bg-white px-3 py-2 rounded-lg flex items-center gap-2'>
        {/* Title */}
        <Input
          id='title'
          className='w-full'
          label='Title'
          disabled={false}
          register={register}
          errors={errors}
          type='text'
          icon={MdOutlineFormatColorText}
          onFocus={() => clearErrors('title')}
        />

        {/* Order */}
        <Input
          id='order'
          className='w-full'
          label='Order'
          disabled={false}
          register={register}
          errors={errors}
          type='number'
          min={0}
          icon={MdOutlineFormatColorText}
          onFocus={() => clearErrors('order')}
        />

        {/* Reset Button */}
        <button
          className='group flex items-center text-nowrap bg-yellow-400 text-[16px] font-semibold py-2 px-3 rounded-md cursor-pointer hover:bg-slate-800 text-white common-transition'
          title='Alt + R'
          onClick={handleResetFilter}>
          Add
        </button>
      </div>

      {/* MARK: MAIN LIST */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-21'></div>
    </div>
  )
}

export default AllCourseChaptersPage
