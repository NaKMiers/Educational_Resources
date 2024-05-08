'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import VoucherItem from '@/components/admin/VoucherItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IVoucher } from '@/models/VoucherModel'
import { activateVouchersApi, deleteVouchersApi, getAllVouchersApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { formatPrice } from '@/utils/number'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCalendar, FaSearch, FaSort } from 'react-icons/fa'

export type VoucherWithOwner = IVoucher & { owner: { firstName: string; lastName: string } }

function AllVouchersPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [vouchers, setVouchers] = useState<VoucherWithOwner[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])

  // loading and confirming
  const [loadingVouchers, setLoadingVouchers] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minMinTotal, setMinMinTotal] = useState<number>(0)
  const [maxMinTotal, setMaxMinTotal] = useState<number>(0)
  const [minTotal, setMinTotal] = useState<number>(0)

  const [minMaxReduce, setMinMaxReduce] = useState<number>(0)
  const [maxMaxReduce, setMaxMaxReduce] = useState<number>(0)
  const [maxReduce, setMaxReduce] = useState<number>(0)

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'updatedAt|-1',
      type: '',
      active: '',
      timesLeft: '',
      beginFrom: '',
      beginTo: '',
      expireFrom: '',
      expireTo: '',
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
  // get all vouchers
  useEffect(() => {
    // get all vouchers
    const getAllVouchers = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { vouchers, amount, chops } = await getAllVouchersApi(query) // cache: no-store

        // set vouchers to state
        setVouchers(vouchers)
        setAmount(amount)

        // sync search params with states
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('type', searchParams?.type || getValues('type'))
        setValue('active', searchParams?.active || getValues('active'))
        setValue('timesLeft', searchParams?.timesLeft || getValues('timesLeft'))
        setValue('beginFrom', searchParams?.beginFrom || getValues('beginFrom'))
        setValue('beginTo', searchParams?.beginTo || getValues('beginTo'))
        setValue('expireFrom', searchParams?.expireFrom || getValues('expireFrom'))
        setValue('expireTo', searchParams?.expireTo || getValues('expireTo'))

        // get min - max
        setMinMinTotal(chops.minMinTotal)
        setMaxMinTotal(chops.maxMinTotal)
        setMinTotal(searchParams?.minTotal ? +searchParams.minTotal : chops.maxMinTotal)

        setMinMaxReduce(chops.minMaxReduce)
        setMaxMaxReduce(chops.maxMaxReduce)
        setMaxReduce(searchParams?.maxReduce ? +searchParams.maxReduce : chops.maxMaxReduce)
      } catch (err: any) {
        console.log(err)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllVouchers()
  }, [dispatch, searchParams, setValue, getValues])

  // MARK: Handlers
  // activate voucher
  const handleActivateVouchers = useCallback(async (ids: string[], value: boolean) => {
    try {
      // senred request to server
      const { updatedVouchers, message } = await activateVouchersApi(ids, value)

      // update vouchers from state
      setVouchers(prev =>
        prev.map(voucher =>
          updatedVouchers.map((voucher: VoucherWithOwner) => voucher._id).includes(voucher._id)
            ? { ...voucher, active: value }
            : voucher
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // delete voucher
  const handleDeleteVouchers = useCallback(async (ids: string[]) => {
    setLoadingVouchers(ids)

    try {
      // senred request to server
      const { deletedVouchers, message } = await deleteVouchersApi(ids)

      // remove deleted vouchers from state
      setVouchers(prev =>
        prev.filter(
          voucher => !deletedVouchers.map((voucher: IVoucher) => voucher._id).includes(voucher._id)
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingVouchers([])
      setSelectedVouchers([])
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

      const { beginFrom, beginTo, expireFrom, expireTo, ...rest } = data
      if (beginFrom || beginTo) {
        rest.begin = (beginFrom || '') + '|' + (beginTo || '')
      }

      if (expireFrom || expireTo) {
        rest.expire = (expireFrom || '') + '|' + (expireTo || '')
      }

      return {
        ...rest,
        minTotal: minTotal === maxMinTotal ? [] : [minTotal.toString()],
        maxReduce: maxReduce === maxMaxReduce ? [] : [maxReduce.toString()],
      }
    },
    [minTotal, maxMinTotal, maxReduce, maxMaxReduce, searchParams, defaultValues]
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
        setSelectedVouchers(prev =>
          prev.length === vouchers.length ? [] : vouchers.map(voucher => voucher._id)
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
  }, [handleFilter, handleResetFilter, handleSubmit, vouchers])

  return (
    <div className='w-full'>
      {/* MARK: Top & Pagination */}
      <AdminHeader title='All Vouchers' addLink='/admin/voucher/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* MARK: Filter */}
      <AdminMeta handleFilter={handleSubmit(handleFilter)} handleResetFilter={handleResetFilter}>
        {/* Search */}
        <div className='flex flex-col col-span-12'>
          <Input
            className='md:max-w-[450px]'
            id='search'
            label='Search'
            disabled={false}
            register={register}
            errors={errors}
            type='text'
            icon={FaSearch}
            onFocus={() => clearErrors('search')}
          />
        </div>

        {/* Min Total */}
        <div className='flex flex-col col-span-12 md:col-span-6'>
          <label htmlFor='minTotal'>
            <span className='font-bold'>Min Total: </span>
            <span>{formatPrice(minTotal || maxMinTotal)}</span> - <span>{formatPrice(maxMinTotal)}</span>
          </label>
          <input
            id='minTotal'
            className='input-range h-2 bg-slate-200 rounded-lg my-2'
            placeholder=' '
            disabled={false}
            type='range'
            min={minMinTotal || 0}
            max={maxMinTotal || 0}
            value={minTotal}
            onChange={e => setMinTotal(+e.target.value)}
          />
        </div>

        {/* Max Reduce */}
        <div className='flex flex-col col-span-12 md:col-span-6'>
          <label htmlFor='maxReduce'>
            <span className='font-bold'>Max Reduce: </span>
            <span>{formatPrice(maxReduce || maxMaxReduce)}</span> -{' '}
            <span>{formatPrice(maxMaxReduce)}</span>
          </label>
          <input
            id='maxReduce'
            className='input-range h-2 bg-slate-200 rounded-lg my-2'
            placeholder=' '
            disabled={false}
            type='range'
            min={minMaxReduce || 0}
            max={maxMaxReduce || 0}
            value={maxReduce}
            onChange={e => setMaxReduce(+e.target.value)}
          />
        </div>

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

          {/* Times Left */}
          <Input
            id='timesLeft'
            label='Times Left'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('timesLeft')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'true',
                label: 'Still',
              },
              {
                value: 'false',
                label: 'Run Out',
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

          {/* Active */}
          <Input
            id='active'
            label='Active'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('active')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'true',
                label: 'On',
              },
              {
                value: 'false',
                label: 'Off',
              },
            ]}
            className='min-w-[108px]'
          />
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-wrap justify-end items-center gap-2 col-span-12'>
          {/* Select All Button */}
          <button
            className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-white common-transition'
            onClick={() =>
              setSelectedVouchers(
                selectedVouchers.length > 0 ? [] : vouchers.map(voucher => voucher._id)
              )
            }>
            {selectedVouchers.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Activate Many Button */}
          {selectedVouchers.some(id => !vouchers.find(voucher => voucher._id === id)?.active) && (
            <button
              className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-white common-transition'
              onClick={() => handleActivateVouchers(selectedVouchers, true)}>
              Activate
            </button>
          )}

          {/* Deactivate Many Button */}
          {selectedVouchers.some(id => vouchers.find(voucher => voucher._id === id)?.active) && (
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white common-transition'
              onClick={() => handleActivateVouchers(selectedVouchers, false)}>
              Deactivate
            </button>
          )}

          {/* Delete Many Button */}
          {!!selectedVouchers.length && (
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
        title='Delete Vouchers'
        content='Are you sure that you want to delete these vouchers?'
        onAccept={() => handleDeleteVouchers(selectedVouchers)}
        isLoading={loadingVouchers.length > 0}
      />

      {/* MARK: Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} voucher
        {amount > 1 ? 's' : ''}
      </div>

      {/* MARK: MAIN LIST */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-21'>
        {vouchers.map(voucher => (
          <VoucherItem
            data={voucher}
            loadingVouchers={loadingVouchers}
            selectedVouchers={selectedVouchers}
            setSelectedVouchers={setSelectedVouchers}
            handleActivateVouchers={handleActivateVouchers}
            handleDeleteVouchers={handleDeleteVouchers}
            key={voucher._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllVouchersPage
