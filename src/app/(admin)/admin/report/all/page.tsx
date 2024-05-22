'use client'

import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import ReportItem from '@/components/admin/ReportItem'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IReport } from '@/models/ReportModel'
import { deleteReportsApi, getAllReportsApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSort } from 'react-icons/fa'

function AllReportsPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [reports, setReports] = useState<IReport[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  // loading and confirming
  const [loadingReports, setLoadingReports] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 10

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      sort: 'updatedAt|-1',
      type: '',
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
  // get all reports
  useEffect(() => {
    // get all reports
    const getAllReports = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { reports, amount } = await getAllReportsApi(query) // cache: no-store

        // set to states
        setReports(reports)
        setAmount(amount)

        // sync search params with states
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('type', searchParams?.type || getValues('type'))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllReports()
  }, [dispatch, searchParams, setValue, getValues])

  // MARK: Handlers
  // delete report
  const handleDeleteReports = useCallback(async (ids: string[]) => {
    setLoadingReports(ids)

    try {
      // senred request to server
      const { deletedReports, message } = await deleteReportsApi(ids)

      // remove deleted reports from state
      setReports(prev =>
        prev.filter(report => !deletedReports.map((report: IReport) => report._id).includes(report._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingReports([])
      setSelectedReports([])
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
    [handleOptimizeFilter, searchParams, router, pathname]
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
        setSelectedReports(prev =>
          prev.length === reports.length ? [] : reports.map(report => report._id)
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
  }, [reports, selectedReports, handleDeleteReports, handleFilter, handleSubmit, handleResetFilter])

  return (
    <div className='w-full'>
      {/* MARK: Top & Pagination */}
      <AdminHeader title='All Reports' addLink='/admin/report/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* MARK: Filter */}
      <AdminMeta handleFilter={handleSubmit(handleFilter)} handleResetFilter={handleResetFilter}>
        {/* MARK: Select Filter */}
        <div className='flex items-center flex-wrap gap-3 col-span-12 md:col-span-4'>
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

          {/* Type */}
          <Input
            id='type'
            label='Type'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('type')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'question',
                label: 'Question',
              },
              {
                value: 'comment',
                label: 'Comment',
              },
              {
                value: 'lesson',
                label: 'Lesson',
              },
              {
                value: 'course',
                label: 'Course',
              },
            ]}
            className='min-w-[120px]'
          />
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-wrap justify-end items-center gap-2 col-span-12 md:col-span-4'>
          {/* Select All Button */}
          <button
            className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-white trans-200'
            onClick={() =>
              setSelectedReports(selectedReports.length > 0 ? [] : reports.map(report => report._id))
            }>
            {selectedReports.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Delete Many Button */}
          {!!selectedReports.length && (
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
        title='Delete Reports'
        content='Are you sure that you want to delete these reports?'
        onAccept={() => handleDeleteReports(selectedReports)}
        isLoading={loadingReports.length > 0}
      />

      {/* MARK: Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} report
        {amount > 1 ? 's' : ''}
      </div>

      {/* MARK: MAIN LIST */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-21 lg:grid-cols-5'>
        {reports.map(report => (
          <ReportItem
            data={report}
            loadingReports={loadingReports}
            selectedReports={selectedReports}
            setSelectedReports={setSelectedReports}
            handleDeleteReports={handleDeleteReports}
            key={report._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllReportsPage
