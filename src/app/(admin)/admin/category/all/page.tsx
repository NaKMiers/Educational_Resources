'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import CategoryItem from '@/components/admin/CategoryItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { deleteCategoriesApi, getAllCagetoriesApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSort } from 'react-icons/fa'

export type EditingValues = {
  _id: string
  title: string
}

function AllCategoriesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [categories, setCategories] = useState<ICategory[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // loading and confirming
  const [loadingCategories, setLoadingCategories] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 10
  const [minPQ, setMinPQ] = useState<number>(0)
  const [maxPQ, setMaxPQ] = useState<number>(0)
  const [productQuantity, setProductQuantity] = useState<number>(0)

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
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
  // get all categories
  useEffect(() => {
    // get all categories
    const getAllCategories = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { categories, amount, chops } = await getAllCagetoriesApi(query) // cache: no-store

        // set to states
        setCategories(categories)
        setAmount(amount)

        // sync search params with states
        setValue('sort', searchParams?.sort || getValues('sort'))

        // set min and max
        setMinPQ(chops.minProductQuantity)
        setMaxPQ(chops.maxProductQuantity)
        setProductQuantity(
          searchParams?.productQuantity ? +searchParams.productQuantity : chops.maxProductQuantity
        )
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllCategories()
  }, [dispatch, searchParams, setValue, getValues])

  // MARK: Handlers
  // handle delete category
  const handleDeleteCategories = useCallback(async (ids: string[]) => {
    setLoadingCategories(ids)

    try {
      // senred request to server
      const { deletedCategories, message } = await deleteCategoriesApi(ids)

      // remove deleted tags from state
      setCategories(prev =>
        prev.filter(
          category =>
            !deletedCategories.map((category: ICategory) => category._id).includes(category._id)
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingCategories([])
      setSelectedCategories([])
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
        productQuantity: productQuantity === maxPQ ? [] : [productQuantity.toString()],
      }
    },
    [productQuantity, maxPQ, searchParams, defaultValues]
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
        setSelectedCategories(prev =>
          prev.length === categories.length ? [] : categories.map(category => category._id)
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
  }, [categories, selectedCategories, handleDeleteCategories, handleSubmit])

  return (
    <div className='w-full'>
      {/* MARK: Top & Pagination */}
      <AdminHeader title='All Categories' addLink='/admin/category/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* MARK: Filter */}
      <AdminMeta handleFilter={handleSubmit(handleFilter)} handleResetFilter={handleResetFilter}>
        {/* Product Quantity */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <label htmlFor='productQuantity'>
            <span className='font-bold'>Product Quantity: </span>
            <span>{productQuantity}</span> - <span>{maxPQ}</span>
          </label>
          <input
            id='productQuantity'
            className='input-range h-2 bg-slate-200 rounded-lg my-2'
            placeholder=' '
            disabled={false}
            type='range'
            min={minPQ || 0}
            max={maxPQ || 0}
            value={productQuantity}
            onChange={e => setProductQuantity(+e.target.value)}
          />
        </div>

        {/* MARK: Select Filter */}
        <div className='flex justify-end items-center flex-wrap gap-3 col-span-12 md:col-span-4'>
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
            className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-white common-transition'
            onClick={() =>
              setSelectedCategories(selectedCategories.length > 0 ? [] : categories.map(tag => tag._id))
            }>
            {selectedCategories.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Delete Many Button */}
          {!!selectedCategories.length && (
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
        title='Delete Categories'
        content='Are you sure that you want to delete these categories?'
        onAccept={() => handleDeleteCategories(selectedCategories)}
        isLoading={loadingCategories.length > 0}
      />

      {/* MARK: Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount}{' '}
        {amount > 1 ? 'categories' : 'category'}
      </div>

      {/* MARK: MAIN LIST */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-21'>
        {categories.map(category => (
          <CategoryItem
            data={category}
            loadingCategories={loadingCategories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            handleDeleteCategories={handleDeleteCategories}
            key={category._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllCategoriesPage
