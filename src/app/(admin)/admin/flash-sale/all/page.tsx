'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import FlashSaleItem from '@/components/admin/FlashSaleItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { deleteFlashSalesApi, getAllFlashSalesApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCalendar, FaSort } from 'react-icons/fa'

function AllFlashSalesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [flashSales, setFlashSales] = useState<IFlashSale[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedFlashSales, setSelectedFlashSales] = useState<string[]>([])

  // loading and confirming
  const [loadingFlashSales, setLoadingFlashSales] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9

  // form
  const defaultValues: FieldValues = useMemo(
    () => ({
      sort: 'updatedAt|-1',
      type: '',
      timeType: '',
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
  // get all flash sales
  useEffect(() => {
    // get all flash sales
    const getAllFlashSales = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to server to get all flash sales
        const { flashSales, amount } = await getAllFlashSalesApi(query) // cache: no-store

        // set vouchers to state
        setFlashSales(flashSales)
        setAmount(amount)

        // sync search params with states
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('type', searchParams?.type || getValues('type'))
        setValue('timeType', searchParams?.timeType || getValues('timeType'))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    getAllFlashSales()
  }, [dispatch, searchParams, setValue, getValues])

  // MARK: Handlers
  // delete voucher
  const handleDeleteFlashSales = useCallback(
    async (ids: string[]) => {
      setLoadingFlashSales(ids)

      try {
        // from selected flash sales, get course ids
        const courseIds = flashSales
          .filter(flashSale => ids.includes(flashSale._id))
          .reduce(
            (acc, flashSale) => [...acc, ...(flashSale.courses as ICourse[]).map(course => course._id)],
            [] as string[]
          )

        // send request to server
        const { deletedFlashSales, message } = await deleteFlashSalesApi(ids, courseIds)

        // remove deleted flash sales from state
        setFlashSales(prev =>
          prev.filter(
            flashSale =>
              !deletedFlashSales.map((flashSale: IFlashSale) => flashSale._id).includes(flashSale._id)
          )
        )

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        setLoadingFlashSales([])
        setSelectedFlashSales([])
      }
    },
    [flashSales]
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

      const { beginFrom, beginTo, expireFrom, expireTo, ...rest } = data

      const begin = (beginFrom || '') + '|' + (beginTo || '')
      if (begin !== '|') {
        rest.begin = begin
      }
      const expire = (expireFrom || '') + '|' + (expireTo || '')
      if (expire !== '|') {
        rest.expire = expire
      }

      return {
        ...rest,
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
        setSelectedFlashSales(prev =>
          prev.length === flashSales.length ? [] : flashSales.map(flashSale => flashSale._id)
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
  }, [handleFilter, handleResetFilter, handleSubmit, flashSales])

  return (
    <div className='w-full'>
      {/* MARK: Top & Pagination */}
      <AdminHeader title='All Flash Sales' addLink='/admin/flash-sale/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* MARK: Filter */}
      <AdminMeta handleFilter={handleSubmit(handleFilter)} handleResetFilter={handleResetFilter}>
        {/* Begin */}
        <div className='flex flex-wrap sm:flex-nowrap gap-2 col-span-12 lg:col-span-6'>
          <Input
            id='beginFrom'
            label='Begin From'
            disabled={false}
            register={register}
            errors={errors}
            type='date'
            icon={FaCalendar}
            className='w-full'
            onFocus={() => clearErrors('beginFrom')}
          />

          <Input
            id='beginTo'
            label='Begin To'
            disabled={false}
            register={register}
            errors={errors}
            type='date'
            icon={FaCalendar}
            className='w-full'
            onFocus={() => clearErrors('beginTo')}
          />
        </div>

        {/* Expire */}
        <div className='flex flex-wrap sm:flex-nowrap gap-2 col-span-12 lg:col-span-6'>
          <Input
            id='expireFrom'
            label='Expire From'
            disabled={false}
            register={register}
            errors={errors}
            type='date'
            icon={FaCalendar}
            className='w-full'
            onFocus={() => clearErrors('expireFrom')}
          />

          <Input
            id='expireTo'
            label='Expire To'
            disabled={false}
            register={register}
            errors={errors}
            type='date'
            icon={FaCalendar}
            className='w-full'
            onFocus={() => clearErrors('expireTo')}
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

          {/* Time Type */}
          <Input
            id='timeType'
            label='Time Type'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('timeType')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'loop',
                label: 'Loop',
              },
              {
                value: 'once',
                label: 'Once',
              },
            ]}
            className='min-w-[128px]'
          />

          {/* type */}
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
                value: 'percentage',
                label: 'Percentage',
              },
              {
                value: 'fixed-reduce',
                label: 'Fixed Reduce',
              },
              {
                value: 'fixed',
                label: 'Fixed',
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
              setSelectedFlashSales(
                selectedFlashSales.length > 0 ? [] : flashSales.map(flashSale => flashSale._id)
              )
            }>
            {selectedFlashSales.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Delete Many Button */}
          {!!selectedFlashSales.length && (
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
        title='Delete Flash Sales'
        content='Are you sure that you want to delete these flash sales?'
        onAccept={() => handleDeleteFlashSales(selectedFlashSales)}
        isLoading={loadingFlashSales.length > 0}
      />

      {/* MARK: Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} flash sale
        {amount > 1 ? 's' : ''}
      </div>

      {/* MARK: MAIN LIST */}
      <div className='grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-21 '>
        {flashSales.map(flashSale => (
          <FlashSaleItem
            data={flashSale}
            loadingFlashSales={loadingFlashSales}
            selectedFlashSales={selectedFlashSales}
            setSelectedFlashSales={setSelectedFlashSales}
            handleDeleteFlashSales={handleDeleteFlashSales}
            key={flashSale._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllFlashSalesPage
