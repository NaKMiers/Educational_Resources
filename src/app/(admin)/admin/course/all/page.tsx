'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import CourseItem from '@/components/admin/CourseItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { ITag } from '@/models/TagModel'
import {
  activateCoursesApi,
  deleteCoursesApi,
  getAllCoursesApi,
  removeApplyingFlashSalesApi,
} from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { formatPrice } from '@/utils/number'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSort } from 'react-icons/fa'

function AllCoursesPage({ searchParams }: { searchParams?: { [key: string]: string[] | string } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [courses, setCourses] = useState<ICourse[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [tgs, setTgs] = useState<ITag[]>([])
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([])
  const [cates, setCates] = useState<ICategory[]>([])
  const [selectedFilterCates, setSelectedFilterCates] = useState<string[]>([])

  // loading and confirming
  const [loadingCourses, setLoadingCourses] = useState<string[]>([])
  const [syncingCourses, setSyncingCourses] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)

  const [minSold, setMinSold] = useState<number>(0)
  const [maxSold, setMaxSold] = useState<number>(0)
  const [sold, setSold] = useState<number>(0)

  const [minStock, setMinStock] = useState<number>(0)
  const [maxStock, setMaxStock] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)

  // Form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      sort: 'updatedAt|-1',
      active: '',
      flashsale: '',
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

  // get all courses
  useEffect(() => {
    // get all courses
    const getAllCourses = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to server to get all courses
        const { courses, amount, cates, tgs, chops } = await getAllCoursesApi(query)

        // set courses to state
        setCourses(courses)
        setAmount(amount)
        setCates(cates)
        setTgs(tgs)

        setSelectedFilterCates(
          []
            .concat((searchParams?.category || cates.map((cate: ICategory) => cate._id)) as [])
            .map(type => type)
        )

        setSelectedFilterTags(
          [].concat((searchParams?.tags || tgs.map((tag: ITag) => tag._id)) as []).map(type => type)
        )

        // sync search params with states
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('active', searchParams?.active || getValues('active'))
        setValue('flashsale', searchParams?.flashsale || getValues('flashsale'))

        // get min - max
        setMinPrice(chops.minPrice)
        setMaxPrice(chops.maxPrice)
        setPrice(searchParams?.price ? +searchParams.price : chops.maxPrice)

        setMinStock(chops.minStock)
        setMaxStock(chops.maxStock)
        setStock(searchParams?.stock ? +searchParams.stock : chops.maxStock)

        setMinSold(chops.minSold)
        setMaxSold(chops.maxSold)
        setSold(searchParams?.sold ? +searchParams.sold : chops.maxSold)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllCourses()
  }, [dispatch, searchParams, setValue, getValues])

  // activate course
  const handleActivateCourses = useCallback(async (ids: string[], value: boolean) => {
    try {
      // senred request to server
      const { updatedCourses, message } = await activateCoursesApi(ids, value)

      // update courses from state
      setCourses(prev =>
        prev.map(course =>
          updatedCourses.map((course: ICourse) => course._id).includes(course._id)
            ? { ...course, active: value }
            : course
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // remove applying flashsales
  const hanldeRemoveApplyingFlashsales = useCallback(async (ids: string[]) => {
    try {
      // send request to server
      const { updatedCourses, message } = await removeApplyingFlashSalesApi(ids)

      // update courses from state
      setCourses(prev =>
        prev.map(course =>
          updatedCourses.map((course: ICourse) => course._id).includes(course._id)
            ? { ...course, flashsale: undefined }
            : course
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // delete course
  const handleDeleteCourses = useCallback(async (ids: string[]) => {
    setLoadingCourses(ids)

    try {
      // senred request to server
      const { deletedCourses, message } = await deleteCoursesApi(ids)

      // remove deleted courses from state
      setCourses(prev =>
        prev.filter(course => !deletedCourses.map((course: ICourse) => course._id).includes(course._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingCourses([])
      setSelectedCourses([])
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
        price: price === maxPrice ? [] : [price.toString()],
        sold: sold === maxSold ? [] : [sold.toString()],
        stock: stock === maxStock ? [] : [stock.toString()],
        category: selectedFilterCates.length === cates.length ? [] : selectedFilterCates,
        tags: selectedFilterTags.length === tgs.length ? [] : selectedFilterTags,
      }
    },
    [
      cates,
      maxPrice,
      maxSold,
      maxStock,
      price,
      selectedFilterCates,
      selectedFilterTags,
      sold,
      stock,
      tgs,
      searchParams,
      defaultValues,
    ]
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
        setSelectedCourses(prev =>
          prev.length === courses.length ? [] : courses.map(course => course._id)
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
  }, [handleFilter, handleResetFilter, courses, handleSubmit])

  return (
    <div className='w-full'>
      {/* Top & Pagination */}
      <AdminHeader title='All Courses' addLink='/admin/course/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* Filter */}
      <AdminMeta handleFilter={handleSubmit(handleFilter)} handleResetFilter={handleResetFilter}>
        {/* Price */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <label htmlFor='price'>
            <span className='font-bold'>Price: </span>
            <span>{formatPrice(price)}</span> - <span>{formatPrice(maxPrice)}</span>
          </label>
          <input
            id='price'
            className='input-range h-2 bg-slate-200 rounded-lg my-2'
            placeholder=' '
            disabled={false}
            type='range'
            min={minPrice || 0}
            max={maxPrice || 0}
            value={price}
            onChange={e => setPrice(+e.target.value)}
          />
        </div>

        {/* Sold */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <label htmlFor='sold'>
            <span className='font-bold'>Sold: </span>
            <span>{sold}</span> - <span>{maxSold}</span>
          </label>
          <input
            id='sold'
            className='input-range h-2 bg-slate-200 rounded-lg my-2'
            placeholder=' '
            disabled={false}
            type='range'
            min={minSold || 0}
            max={maxSold || 0}
            value={sold}
            onChange={e => setSold(+e.target.value)}
          />
        </div>

        {/* Stock */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <label htmlFor='stock'>
            <span className='font-bold'>Stock: </span>
            <span>{stock}</span> - <span>{maxStock}</span>
          </label>
          <input
            id='stock'
            className='input-range h-2 bg-slate-200 rounded-lg my-2'
            placeholder=' '
            disabled={false}
            type='range'
            min={minStock || 0}
            max={maxStock || 0}
            value={stock}
            onChange={e => setStock(+e.target.value)}
          />
        </div>

        {/* Cate Selection */}
        <div className='flex justify-end items-end gap-1 flex-wrap max-h-[228px] md:max-h-[152px] lg:max-h-[152px] overflow-auto col-span-12'>
          <div
            className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
              cates.length === selectedFilterCates.length
                ? 'bg-dark-100 text-white border-dark-100'
                : 'border-slate-300'
            }`}
            title='All Types'
            onClick={() =>
              setSelectedFilterCates(
                cates.length === selectedFilterCates.length ? [] : cates.map(category => category._id)
              )
            }>
            All
          </div>
          {cates.map(category => (
            <div
              className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
                selectedFilterCates.includes(category._id)
                  ? 'bg-primary text-white border-primary'
                  : 'border-slate-300'
              }`}
              title={category.title}
              key={category._id}
              onClick={
                selectedFilterCates.includes(category._id)
                  ? () => setSelectedFilterCates(prev => prev.filter(id => id !== category._id))
                  : () => setSelectedFilterCates(prev => [...prev, category._id])
              }>
              {category.title}
            </div>
          ))}
        </div>

        {/* Tag Selection */}
        <div className='flex justify-end items-end gap-1 flex-wrap max-h-[228px] md:max-h-[152px] lg:max-h-[152px] overflow-auto col-span-12'>
          <div
            className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
              tgs.length === selectedFilterTags.length
                ? 'bg-dark-100 text-white border-dark-100'
                : 'border-slate-300'
            }`}
            title='All Types'
            onClick={() =>
              setSelectedFilterTags(
                tgs.length === selectedFilterTags.length ? [] : tgs.map(tag => tag._id)
              )
            }>
            All
          </div>
          {tgs.map(tag => (
            <div
              className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
                selectedFilterTags.includes(tag._id)
                  ? 'bg-secondary text-white border-secondary'
                  : 'border-slate-300'
              }`}
              title={tag.title}
              key={tag._id}
              onClick={
                selectedFilterTags.includes(tag._id)
                  ? () => setSelectedFilterTags(prev => prev.filter(id => id !== tag._id))
                  : () => setSelectedFilterTags(prev => [...prev, tag._id])
              }>
              {tag.title}
            </div>
          ))}
        </div>

        {/* Select Filter */}
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
            className='min-w-[104px]'
          />

          {/* Flash Sale */}
          <Input
            id='flashsale'
            label='Flash Sale'
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type='select'
            onFocus={() => clearErrors('flashsale')}
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
            className='min-w-[124px]'
          />
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap justify-end items-center col-span-12 gap-2'>
          {/* Select All Button */}
          <button
            className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-white common-transition'
            onClick={() =>
              setSelectedCourses(selectedCourses.length > 0 ? [] : courses.map(course => course._id))
            }>
            {selectedCourses.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Activate Many Button */}
          {/* Only show activate button if at least 1 course is selected and at least 1 selected course is deactive */}
          {!!selectedCourses.length &&
            selectedCourses.some(id => !courses.find(course => course._id === id)?.active) && (
              <button
                className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-white common-transition'
                onClick={() => handleActivateCourses(selectedCourses, true)}>
                Activate
              </button>
            )}

          {/* Deactivate Many Button */}
          {/* Only show deactivate button if at least 1 course is selected and at least 1 selected course is acitve */}
          {!!selectedCourses.length &&
            selectedCourses.some(id => courses.find(course => course._id === id)?.active) && (
              <button
                className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white common-transition'
                onClick={() => handleActivateCourses(selectedCourses, false)}>
                Deactivate
              </button>
            )}

          {/* Remove Flash Sale Many Button */}
          {!!selectedCourses.length &&
            selectedCourses.some(id => courses.find(course => course._id === id)?.flashSale) && (
              <button
                className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white common-transition'
                onClick={() => {
                  hanldeRemoveApplyingFlashsales(selectedCourses)
                }}>
                Remove Flash Sale
              </button>
            )}

          {/* Delete Many Button */}
          {!!selectedCourses.length && (
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
        title='Delete Courses'
        content='Are you sure that you want to delete these courses?'
        onAccept={() => handleDeleteCourses(selectedCourses)}
        isLoading={loadingCourses.length > 0}
      />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} course
        {amount > 1 ? 's' : ''}
      </div>

      {/* MAIN LIST */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-21 lg:grid-cols-3'>
        {courses.map(course => (
          <CourseItem
            data={course}
            loadingCourses={loadingCourses}
            // selected
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            // functions
            handleActivateCourses={handleActivateCourses}
            hanldeRemoveApplyingFlashsales={hanldeRemoveApplyingFlashsales}
            handleDeleteCourses={handleDeleteCourses}
            key={course._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllCoursesPage
