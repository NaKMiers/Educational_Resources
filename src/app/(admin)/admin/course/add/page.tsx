'use client'

import Divider from '@/components/Divider'
import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import { addCourseApi, getForceAllCategoriesApi, getForceAllTagsApi } from '@/requests'
import Image from 'next/image'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaFile, FaMoneyBillAlt, FaUser } from 'react-icons/fa'
import { FaPlay, FaX } from 'react-icons/fa6'
import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddCoursePage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)

  // states
  const [tags, setTags] = useState<ITag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isChecked, setIsChecked] = useState<boolean>(true)

  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      price: '',
      oldPrice: '',
      author: '',
      description: '',
      active: true,
    },
  })

  // get tags and categories
  useEffect(() => {
    const getTags = async () => {
      try {
        // send request to server to get all tags
        const { tags } = await getForceAllTagsApi() // cache: no-store
        setTags(tags)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    const getCategories = async () => {
      try {
        // send request to server to get all categories
        const { categories } = await getForceAllCategoriesApi() // cache: no-store
        setCategories(categories)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getTags()
    getCategories()
  }, [])

  // revoke blob url when component unmount
  useEffect(() => {
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [imageUrls])

  // handle add files when user select files
  const handleAddFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let newFiles = Array.from(e.target.files)

      // validate files's type and size
      newFiles = newFiles.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image file`)
          return false
        }
        if (file.size > 3 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Only accept images under 3MB`)
          return false
        }
        return true
      })

      setFiles(prev => [...prev, ...newFiles])

      const urls = newFiles.map(file => URL.createObjectURL(file))
      setImageUrls(prev => [...prev, ...urls])

      e.target.value = ''
      e.target.files = null
    }
  }, [])

  // handle remove image
  const handleRemoveImage = useCallback(
    (url: string) => {
      const index = imageUrls.indexOf(url)

      // remove file from files
      const newFiles = files.filter((_, i) => i !== index)
      setFiles(newFiles)

      setImageUrls(prev => prev.filter(u => u !== url))
      URL.revokeObjectURL(url)
    },
    [files, imageUrls]
  )

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // price >= 0
      if (data.price < 0) {
        setError('price', { type: 'manual', message: 'Price must be >= 0' })

        isValid = false
      }

      if (data.oldPrice && data.oldPrice < 0) {
        setError('oldPrice', { type: 'manual', message: 'Old price must be >= 0' })
        isValid = false
      }

      if (!selectedTags.length) {
        toast.error('Please select at least 1 tag')
        isValid = false
      }

      if (!selectedCategories.length) {
        toast.error('Please select at least 1 category')
        isValid = false
      }

      if (!files.length) {
        toast.error('Please select at least 1 image')
        isValid = false
      }

      return isValid
    },
    [setError, selectedCategories, selectedTags, files]
  )

  // send data to server to create new course
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (!handleValidate(data)) return

    dispatch(setLoading(true))

    try {
      const formData = new FormData()

      formData.append('title', data.title)
      formData.append('price', data.price)
      formData.append('oldPrice', data.oldPrice)
      formData.append('author', data.author)
      formData.append('description', data.description)
      formData.append('active', data.active)
      formData.append('tags', JSON.stringify(selectedTags))
      formData.append('categories', JSON.stringify(selectedCategories))
      files.forEach(file => formData.append('images', file))

      // send request to server to create new course
      const { message } = await addCourseApi(formData)

      // show success message
      toast.success(message)

      // reset form
      setFiles([])
      imageUrls.forEach(url => URL.revokeObjectURL(url))
      setImageUrls([])
      setSelectedTags([])
      setSelectedCategories([])
      reset()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='max-w-1200 mx-auto'>
      <AdminHeader title='Add Course' backLink='/admin/course/all' />

      <Divider size={4} />

      <div className='bg-slate-200 rounded-lg p-21 shadow-lg'>
        <div className='mb-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {/* Title */}
          <Input
            id='title'
            label='Title'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='text'
            icon={RiCharacterRecognitionLine}
            onFocus={() => clearErrors('title')}
          />

          {/* Author */}
          <Input
            id='author'
            label='Author'
            disabled={isLoading}
            register={register}
            required
            errors={errors}
            type='text'
            rows={10}
            icon={FaUser}
            onFocus={() => clearErrors('author')}
          />
        </div>

        <div className='mb-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {/* Price */}
          <Input
            id='price'
            label='Price'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
            icon={FaMoneyBillAlt}
            onFocus={() => clearErrors('price')}
          />

          {/* Old Price */}
          <Input
            id='oldPrice'
            label='Old Price'
            disabled={isLoading}
            register={register}
            errors={errors}
            type='number'
            icon={FaMoneyBillAlt}
            onFocus={() => clearErrors('oldPrice')}
          />
        </div>

        {/* Description */}
        <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          type='textarea'
          rows={10}
          icon={MdNumbers}
          className='mb-5'
          onFocus={() => clearErrors('description')}
        />

        <div className='flex mb-4'>
          <div className='bg-white rounded-lg px-3 flex items-center'>
            <FaPlay size={16} className='text-secondary' />
          </div>
          <label
            className={`select-none cursor-pointer border border-green-500 px-4 py-2 rounded-lg trans-200  ${
              isChecked ? 'bg-green-500 text-white' : 'bg-white text-green-500'
            }`}
            htmlFor='active'
            onClick={() => setIsChecked(!isChecked)}>
            Active
          </label>
          <input type='checkbox' id='active' hidden {...register('active', { required: false })} />
        </div>

        {/* Tags */}
        <div className='mb-5'>
          <p className='text-dark font-semibold text-xl mb-1'>Select Tags</p>

          <div className='p-2 rounded-lg flex flex-wrap items-center bg-white gap-2'>
            {tags.map(tag => (
              <Fragment key={tag._id}>
                <input
                  onChange={e =>
                    setSelectedTags(prev =>
                      e.target.checked ? [...prev, tag._id] : prev.filter(t => t !== tag._id)
                    )
                  }
                  hidden
                  type='checkbox'
                  id={tag._id}
                />
                <label
                  className={`cursor-pointer select-none rounded-lg border border-green-500 text-green-500 py-[6px] px-3 trans-200 ${
                    selectedTags.some(t => t === tag._id) ? 'bg-green-500 text-white' : ''
                  }`}
                  htmlFor={tag._id}>
                  {tag.title}
                </label>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className='mb-5'>
          <p className='text-dark font-semibold text-xl mb-1'>Select Categories</p>

          <div className='p-2 rounded-lg flex flex-wrap items-center bg-white gap-2'>
            {categories.map(category => (
              <Fragment key={category._id}>
                <input
                  onChange={e =>
                    setSelectedCategories(prev =>
                      e.target.checked ? [...prev, category._id] : prev.filter(t => t !== category._id)
                    )
                  }
                  hidden
                  type='checkbox'
                  id={category._id}
                />
                <label
                  className={`cursor-pointer select-none rounded-lg border border-green-500 text-green-500 py-[6px] px-3 trans-200 ${
                    selectedCategories.some(cate => cate === category._id)
                      ? 'bg-green-500 text-white'
                      : ''
                  }`}
                  htmlFor={category._id}>
                  {category.title}
                </label>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className='mb-5'>
          <div className='flex'>
            <span className='inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 border-slate-200 bg-slate-100'>
              <FaFile size={19} className='text-secondary' />
            </span>
            <div className='relative w-full border-[2px] border-l-0 bg-white border-slate-200'>
              <input
                id='images'
                className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
                placeholder=' '
                disabled={isLoading}
                type='file'
                multiple
                onChange={handleAddFiles}
              />

              {/* label */}
              <label
                htmlFor={'images'}
                className='absolute rounded-md text-sm trans-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer text-dark'>
                Images
              </label>
            </div>
          </div>
        </div>

        {!!imageUrls.length && (
          <div className='flex flex-wrap gap-3 rounded-lg bg-white p-3 mb-5'>
            {imageUrls.map(url => (
              <div className='relative aspect-video max-w-[250px]' key={url}>
                <Image
                  className='rounded-lg w-full h-full object-cover'
                  src={url}
                  height={250}
                  width={250}
                  alt='thumbnail'
                />

                <button
                  onClick={() => handleRemoveImage(url)}
                  className='absolute top-2 bg-slate-300 p-2 right-2 group hover:bg-dark-100 rounded-lg'>
                  <FaX size={16} className='text-dark group-hover:text-white trans-200' />
                </button>
              </div>
            ))}
          </div>
        )}

        <LoadingButton
          className='px-4 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-semibold trans-200'
          onClick={handleSubmit(onSubmit)}
          text='Add'
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddCoursePage
