'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { getFlashSaleApi, updateFlashSaleApi } from '@/requests'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaPause, FaPlay } from 'react-icons/fa6'
import { IoReload } from 'react-icons/io5'
import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function EditFlashSalePage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  // states
  const [products, setProducts] = useState<ICourse[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [timeType, setTimeType] = useState<'loop' | 'once'>('loop')

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      type: 'percentage',
      value: '',
      begin: new Date().toISOString().split('T')[0],
      expire: '',
      timeType: 'loop',
      duration: 120,
    },
  })

  // MARK: Get Data
  // get flash sale by id
  useEffect(() => {
    const getProduct = async () => {
      try {
        // send request to server to get flash sale
        const { flashSale } = await getFlashSaleApi(id) // cache: no-store

        // // set value to form
        setValue('type', flashSale.type)
        setValue('value', flashSale.value)
        setValue('begin', new Date(flashSale.begin).toISOString().split('T')[0])
        setValue(
          'expire',
          flashSale.expire ? new Date(flashSale.expire).toISOString().split('T')[0] : ''
        )
        setValue('duration', flashSale.duration || 120)
        setValue('timeType', flashSale.timeType)
        setTimeType(flashSale.timeType)

        setSelectedProducts(flashSale.products.map((product: ICourse) => product._id))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getProduct()
  }, [id, setValue])

  // get all products to apply
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        // // send request to server
        // const { products } = await getForceAllProductsApi()
        // // categorize products
        // const categorizedProductsObj = products.reduce((acc: any, product: ICourse) => {
        //   if (!acc[product.categories.title]) {
        //     acc[product.categories.title] = []
        //   }
        //   acc[product.categories.title].push(product)
        //   return acc
        // }, {})
        // const categorizedProducts = Object.values(categorizedProductsObj).flat() as ICourse[]
        // // set products to state
        // setProducts(categorizedProducts)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getAllProducts()
  }, [])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      if (data.type === 'percentage' && !data.value.endsWith('%')) {
        setError('value', { type: 'manual', message: 'Value must have %' })
        isValid = false
      }

      // if type if percentage, value have '%' at the end and must be number
      if (data.type === 'percentage' && isNaN(Number(data.value.replace('%', '')))) {
        setError('value', { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      // if type if fixed-reduce, value must be number
      if (data.type !== 'percentage' && isNaN(Number(data.value))) {
        setError('value', { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      // if time type is loop, duration must be > 0
      if (data.timeType === 'loop' && data.duration <= 0) {
        setError('duration', { type: 'manual', message: 'Duration must be > 0' })
        isValid = false
      }

      // if expire is less than begin
      if (data.expire && new Date(data.expire) <= new Date(data.begin)) {
        setError('expire', { type: 'manual', message: 'Expire must be > begin' })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Submit
  // handle send request to server to edit flash sale
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    // validate form
    if (!handleValidate(data)) return

    // set loading
    dispatch(setLoading(true))

    try {
      // send request to server
      const { message } = await updateFlashSaleApi(id, data, selectedProducts)

      // show success message
      toast.success(message)

      // redirect back
      router.back()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='max-w-1200 mx-auto'>
      {/* Admin Header */}
      <AdminHeader title='Edit Flash Sale' backLink='/admin/flash-sale/all' />

      <div className='pt-5'>
        {/* Type */}
        <Input
          id='type'
          label='Type'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='select'
          onFocus={() => clearErrors('type')}
          options={[
            {
              label: 'Percentage',
              value: 'percentage',
              selected: true,
            },
            {
              label: 'Fixed-Reduce',
              value: 'fixed-reduce',
              selected: false,
            },
            {
              label: 'Fixed',
              value: 'fixed',
              selected: false,
            },
          ]}
          icon={RiCharacterRecognitionLine}
          className='mb-5'
        />

        {/* Value */}
        <Input
          id='value'
          label='Value'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={MdNumbers}
          className='mb-5'
          onFocus={() => clearErrors('value')}
        />

        {/* Begin */}
        <Input
          id='begin'
          label='Begin'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='date'
          icon={FaPlay}
          className='mb-5'
          onFocus={() => clearErrors('begin')}
        />

        {/* Time Type */}
        <div className='grid grid-col-1 lg:grid-cols-2 gap-5 mb-5'>
          <Input
            id='timeType'
            label='Time Type'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='select'
            onChange={e => {
              setValue('timeType', e.target.value)
              setTimeType(e.target.value as 'loop' | 'once')
            }}
            onFocus={() => clearErrors('timeType')}
            options={[
              {
                label: 'Loop',
                value: 'loop',
                selected: true,
              },
              {
                label: 'Once',
                value: 'once',
                selected: false,
              },
            ]}
            icon={RiCharacterRecognitionLine}
          />

          {timeType === 'loop' && (
            <Input
              id='duration'
              label='Duration'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='number'
              icon={IoReload}
              onFocus={() => clearErrors('duration')}
            />
          )}
          {timeType === 'once' && (
            <Input
              id='expire'
              label='Expire'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='date'
              icon={FaPause}
              onFocus={() => clearErrors('expire')}
            />
          )}
        </div>

        {/* MARK: Ready to apply products */}
        <p className='text-white font-semibold text-xl mb-1'>Select Products</p>
        <div className='max-h-[300px] overflow-y-auto flex flex-wrap rounded-lg bg-white p-3 gap-2 mb-5'>
          {products.map(product => (
            <div
              className={`max-w-[250px] border-2 border-slate-300 rounded-lg flex items-center py-1 px-2 gap-2 cursor-pointer common-transition ${
                selectedProducts.includes(product._id)
                  ? 'bg-secondary border-white text-white'
                  : product.flashSale
                  ? 'bg-slate-200'
                  : ''
              }`}
              title={product.title}
              onClick={() =>
                selectedProducts.includes(product._id)
                  ? setSelectedProducts(prev => prev.filter(id => id !== product._id))
                  : setSelectedProducts(prev => [...prev, product._id])
              }
              key={product._id}>
              <Image
                className='aspect-video rounded-md border-2 border-white'
                src={product.images[0]}
                height={60}
                width={60}
                alt='thumbnail'
              />
              <span className='block text-sm text-ellipsis line-clamp-1 text-nowrap'>
                {product.title}
              </span>
            </div>
          ))}
        </div>

        {/* MARK: Save Button */}
        <LoadingButton
          className='px-4 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-semibold common-transition'
          onClick={handleSubmit(onSubmit)}
          text='Save'
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default EditFlashSalePage