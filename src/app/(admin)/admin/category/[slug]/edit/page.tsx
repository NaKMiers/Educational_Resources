'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { getCategoryApi, updateCategoryApi } from '@/requests'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { IoIosColorPalette } from 'react-icons/io'
import { MdTitle } from 'react-icons/md'

function EditCategoryPage() {
  // store
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  // states
  const [category, setCategory] = useState<ICategory | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)

  // refs
  const logoInputRef = useRef<HTMLInputElement>(null)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      color: '#000',
    },
  })

  useEffect(() => {
    const getCategory = async () => {
      try {
        const { category } = await getCategoryApi(slug)

        setCategory(category)

        // set values to form
        setValue('title', category.title)
        setValue('color', category.color)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
        router.back()
      }
    }

    getCategory()
  }, [setValue, slug, router])

  // handle add files when user select files
  const handleAddFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0]

        // validate file type and size
        if (!file.type.startsWith('image/')) {
          return toast.error('Please select an image file')
        }
        if (file.size > 3 * 1024 * 1024) {
          return toast.error('Please select an image file less than 3MB')
        }

        setFile(file)
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl)
        }
        setImageUrl(URL.createObjectURL(file))

        e.target.value = ''
        e.target.files = null
      }
    },
    [imageUrl]
  )

  // MARK: Submit
  // edit category
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      dispatch(setLoading(true))

      try {
        // add new category here
        const { message } = await updateCategoryApi(slug, data)

        // show success message
        toast.success(message)

        // clear form
        reset()
        setFile(null)
        URL.revokeObjectURL(imageUrl)
        setImageUrl('')

        // redirect back
        router.back()
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch, reset, router, imageUrl, slug]
  )

  // revoke blob url when component unmount
  useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

  // Enter key to submit
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit(onSubmit)()
    }

    window.addEventListener('keydown', handleEnter)
    return () => window.removeEventListener('keydown', handleEnter)
  }, [handleSubmit, onSubmit])

  return (
    <div className='max-w-1200 mx-auto'>
      {/* MARK: Admin Header */}
      <AdminHeader title='Add Category' backLink='/admin/category/all' />

      {/* MARK: Body */}
      <div className='mt-5'>
        <div className='mb-5 flex-wrap flex gap-5'>
          <Input
            id='title'
            label='Title'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='text'
            icon={MdTitle}
            className='flex-1'
            onFocus={() => clearErrors('title')}
          />
          <Input
            id='color'
            label='Color'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='color'
            icon={IoIosColorPalette}
            className='w-full md:w-32'
            onFocus={() => clearErrors('title')}
          />
        </div>
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

export default EditCategoryPage
