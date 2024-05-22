'use client'

import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AddChapter from '@/components/admin/AddChapter'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import ChapterItem from '@/components/admin/ChapterItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IChapter } from '@/models/ChapterModel'
import {} from '@/requests'
import { deleteChaptersApi, getAllCourseChaptersApi } from '@/requests/chapterRequest'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSearch, FaSort } from 'react-icons/fa'

export type EditingValues = {
  _id: string
  title: string
  content: string
  order: number
}

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
  const [editingValues, setEditingValues] = useState<EditingValues | null>(null)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 10

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
        const { chapters, amount } = await getAllCourseChaptersApi(courseId, query) // cache: no-store

        // set to states
        setChapters(chapters)
        setAmount(amount)

        // sync search params with states
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))
      } catch (err: any) {
        console.log(err)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllChapters()
  }, [dispatch, setValue, getValues, searchParams, courseId])

  // MARK: Handlers
  // delete chapter
  const handleDeleteChapters = useCallback(async (ids: string[]) => {
    setLoadingChapters(ids)

    try {
      // senred request to server
      const { deletedChapters, message } = await deleteChaptersApi(ids)
      // remove deleted chapters from state
      setChapters(prev =>
        prev.filter(
          chapter => !deletedChapters.map((chapter: IChapter) => chapter._id).includes(chapter._id)
        )
      )
      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingChapters([])
      setSelectedChapters([])
    }
  }, [])

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
        setSelectedChapters(prev =>
          prev.length === chapters.length ? [] : chapters.map(chapter => chapter._id)
        )
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
  }, [chapters, selectedChapters, handleDeleteChapters, handleFilter, handleSubmit, handleResetFilter])

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
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-wrap justify-end items-center gap-2 col-span-12'>
          {/* Select All Button */}
          <button
            className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-white trans-200'
            onClick={() =>
              setSelectedChapters(
                selectedChapters.length > 0 ? [] : chapters.map(chapter => chapter._id)
              )
            }>
            {selectedChapters.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Delete Many Button */}
          {!!selectedChapters.length && (
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white trans-200'
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
      <AddChapter
        courseId={courseId}
        chapters={chapters}
        setChapters={setChapters}
        editingValues={editingValues}
        setEditingValues={setEditingValues}
      />

      <Divider />

      {/* MARK: MAIN LIST */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-21'>
        {chapters.map(chapter => (
          <ChapterItem
            data={chapter}
            loadingChapters={loadingChapters}
            selectedChapters={selectedChapters}
            setSelectedChapters={setSelectedChapters}
            setEditingValues={setEditingValues}
            handleDeleteChapters={handleDeleteChapters}
            key={chapter._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllCourseChaptersPage
