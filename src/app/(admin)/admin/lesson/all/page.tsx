'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import LessonItem from '@/components/admin/LessonItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { ILesson } from '@/models/LessonModel'
import { activateLessonsApi, deleteLessonsApi, getAllLessonsApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSearch, FaSort } from 'react-icons/fa'
import { GroupCourses } from '../add/page'

function AllLessonsPage({ searchParams }: { searchParams?: { [key: string]: string[] | string } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [lessons, setLessons] = useState<ILesson[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedLessons, setSelectedLessons] = useState<string[]>([])
  const [courses, setCourses] = useState<ICourse[]>([])
  const [groupCourses, setGroupCourses] = useState<GroupCourses>({})
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])

  // loading & opening
  const [loadingLessons, setLoadingLessons] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9

  // form
  const defaultValues = useMemo<FieldValues>(() => {
    return {
      search: '',
      sort: 'updatedAt|-1',
      active: 'true',
      usingUser: 'true',
      expire: '',
      renew: '',
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
    reset,
  } = useForm<FieldValues>({
    defaultValues,
  })

  // MARK: Get Data
  // get all lessons at first time
  useEffect(() => {
    // get all lessons
    const getAllLessons = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { lessons, amount, courses } = await getAllLessonsApi(query) // cache: no-store

        console.log('lessons', lessons)

        // group course by category.title
        const groupCourses: GroupCourses = {}
        courses.forEach((course: ICourse) => {
          course.categories.forEach((category: any) => {
            const categoryTitle = category.title
            if (!groupCourses[categoryTitle]) {
              groupCourses[categoryTitle] = []
            }
            groupCourses[categoryTitle].push(course)
          })
        })

        // update lessons from state
        setLessons(lessons)
        setAmount(amount)
        setGroupCourses(groupCourses)
        setCourses(courses)

        // sync search params with states
        setSelectedCourses(
          []
            .concat((searchParams?.course || courses.map((type: ICourse) => type._id)) as [])
            .map(type => type)
        )
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('active', searchParams?.active || getValues('active').toString())
        setValue('usingUser', searchParams?.usingUser || getValues('usingUser').toString())
        setValue('expire', searchParams?.expire || getValues('expire'))
        setValue('renew', searchParams?.renew || getValues('renew'))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllLessons()
  }, [dispatch, getValues, searchParams, setValue])

  // MARK: Handlers
  // activate lesson
  const handleActivateLessons = useCallback(async (ids: string[], value: boolean) => {
    try {
      // senred request to server
      const { updatedLessons, message } = await activateLessonsApi(ids, value)

      // update lessons from state
      setLessons(prev =>
        prev.map(lesson =>
          updatedLessons.map((lesson: ILesson) => lesson._id).includes(lesson._id)
            ? { ...lesson, active: value }
            : lesson
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // delete lesson
  const handleDeleteLessons = useCallback(
    async (ids: string[]) => {
      setLoadingLessons(ids)

      try {
        // senred request to server
        const { deletedLessons, message } = await deleteLessonsApi(ids)

        // remove deleted tags from state
        setLessons(prev =>
          prev.filter(
            lesson => !deletedLessons.map((lesson: ILesson) => lesson._id).includes(lesson._id)
          )
        )

        // show success message
        toast.success(message)

        // refresh page
        router.refresh()
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        setLoadingLessons([])
        setSelectedLessons([])
      }
    },
    [router]
  )

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
        ...searchParams,
        ...data,
        course: selectedCourses.length === courses.length ? [] : selectedCourses,
      }
    },
    [selectedCourses, courses, searchParams, defaultValues]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      const params: any = handleOptimizeFilter(data)

      // handle query
      const query = handleQuery(params)

      // push to new url
      router.push(pathname + query)
    },
    [handleOptimizeFilter, router, pathname]
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
        setSelectedLessons(prev =>
          prev.length === lessons.length ? [] : lessons.map(lesson => lesson._id)
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
  }, [lessons, selectedLessons, handleDeleteLessons, handleFilter, handleSubmit, handleResetFilter])

  // check all courses of category selected
  const checkAllCoursesOfCategorySelected = useCallback(
    (group: any): boolean => {
      return group.map((type: ICourse) => type._id).every((type: any) => selectedCourses.includes(type))
    },
    [selectedCourses]
  )

  return (
    <div className='w-full'>
      {/* MARK: Top & Pagination */}
      <AdminHeader title='All Lessons' addLink='/admin/lesson/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* MARK: Filter */}
      <AdminMeta handleFilter={handleSubmit(handleFilter)} handleResetFilter={handleResetFilter}>
        {/* Search */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <Input
            className='md:max-w-[450px]'
            id='search'
            label='Search'
            disabled={false}
            register={register}
            errors={errors}
            type='text'
            icon={FaSearch}
            onFocus={() => clearErrors('info')}
          />
        </div>

        {/* Type Selection */}
        <div className='flex justify-end items-end gap-1 flex-wrap max-h-[228px] md:max-h-[152px] lg:max-h-[152px] overflow-auto col-span-12 md:col-span-8'>
          <div
            className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
              courses.length === selectedCourses.length
                ? 'bg-dark-100 text-white border-dark-100'
                : 'border-slate-300'
            }`}
            title='All Courses'
            onClick={() =>
              setSelectedCourses(
                courses.length === selectedCourses.length ? [] : courses.map(type => type._id)
              )
            }>
            All
          </div>
          {Object.keys(groupCourses).map(key => (
            <Fragment key={key}>
              <div
                className={`ml-2 overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
                  checkAllCoursesOfCategorySelected(groupCourses[key])
                    ? 'bg-dark-100 text-white border-dark-100'
                    : 'border-slate-300 bg-slate-200'
                }`}
                title={key}
                onClick={() =>
                  checkAllCoursesOfCategorySelected(groupCourses[key])
                    ? // remove all courses of category
                      setSelectedCourses(prev =>
                        prev.filter(id => !groupCourses[key].map((type: any) => type._id).includes(id))
                      )
                    : // add all courses of category
                      setSelectedCourses(prev => [
                        ...prev,
                        ...groupCourses[key].map((type: any) => type._id),
                      ])
                }>
                {key}
              </div>
              {groupCourses[key].map((course: any) => (
                <div
                  className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
                    selectedCourses.includes(course._id)
                      ? 'bg-secondary text-white border-secondary'
                      : 'border-slate-300'
                  }`}
                  title={course.title}
                  key={course._id}
                  onClick={
                    selectedCourses.includes(course._id)
                      ? () => setSelectedCourses(prev => prev.filter(id => id !== course._id))
                      : () => setSelectedCourses(prev => [...prev, course._id])
                  }>
                  {course.title}
                </div>
              ))}
            </Fragment>
          ))}
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
            onFocus={() => clearErrors('info')}
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

          {/* Active */}
          <Input
            id='active'
            label='Active'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('info')}
            options={[
              {
                value: 'all',
                label: 'All',
              },
              {
                value: true,
                label: 'On',
                selected: true,
              },
              {
                value: false,
                label: 'Off',
              },
            ]}
          />

          {/* Using */}
          <Input
            id='usingUser'
            label='Using'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('info')}
            options={[
              {
                value: 'all',
                label: 'All',
              },
              {
                value: true,
                label: 'Using',
                selected: true,
              },
              {
                value: false,
                label: 'Empty',
              },
            ]}
          />

          {/* Expire */}
          <Input
            id='expire'
            label='Expiry'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('info')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: true,
                label: 'Expired',
              },
              {
                value: false,
                label: 'Normal',
              },
            ]}
          />

          {/* Renew */}
          <Input
            id='renew'
            label='Renew'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('info')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: true,
                label: 'Expired',
              },
              {
                value: false,
                label: 'Normal',
              },
            ]}
          />
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-wrap justify-end items-center gap-2 col-span-12'>
          {/* Select All Button */}
          <button
            className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-white common-transition'
            title='Alt + A'
            onClick={() =>
              setSelectedLessons(selectedLessons.length > 0 ? [] : lessons.map(lesson => lesson._id))
            }>
            {selectedLessons.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Activate Many Button */}
          {selectedLessons.some(id => !lessons.find(lesson => lesson._id === id)?.active) && (
            <button
              className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-white common-transition'
              onClick={() => handleActivateLessons(selectedLessons, true)}>
              Activate
            </button>
          )}

          {/* Deactivate Many Button */}
          {selectedLessons.some(id => lessons.find(lesson => lesson._id === id)?.active) && (
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white common-transition'
              onClick={() => handleActivateLessons(selectedLessons, false)}>
              Deactivate
            </button>
          )}

          {/* Delete Many Button */}
          {!!selectedLessons.length && (
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white common-transition'
              title='Alt + Delete'
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
        title='Delete Lessons'
        content='Are you sure that you want to delete these lessons?'
        onAccept={() => handleDeleteLessons(selectedLessons)}
        isLoading={loadingLessons.length > 0}
      />

      {/* MARK: Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} lesson{amount > 1 && 's'}
      </div>

      {/* MARK: MAIN LIST */}
      <div className='grid gap-21 grid-cols-1 md:grid-cols-2'>
        {lessons.map(lesson => (
          <LessonItem
            data={lesson}
            loadingLessons={loadingLessons}
            // selected
            selectedLessons={selectedLessons}
            setSelectedLessons={setSelectedLessons}
            // functions
            handleActivateLessons={handleActivateLessons}
            handleDeleteLessons={handleDeleteLessons}
            key={lesson._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllLessonsPage
