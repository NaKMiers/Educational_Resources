'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { ITag } from '@/models/TagModel'
import { addTagApi } from '@/requests'
import { useCallback, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaPlay } from 'react-icons/fa'
import { MdTitle } from 'react-icons/md'

function AddTagPage() {
  // store
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      booted: false,
    } as ITag,
  })

  // MARK: Submit
  // add new tag
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      dispatch(setLoading(true))

      try {
        // add new tag login here
        const { message } = await addTagApi(data)

        // show success message
        toast.success(message)

        // clear form
        reset()
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch, reset]
  )

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
      <AdminHeader title='Add Tag' backLink='/admin/tag/all' />

      {/* MARK: Body */}
      <div className='mt-5 bg-slate-200 p-21 rounded-lg'>
        <Input
          id='title'
          label='Title'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={MdTitle}
          className='mb-5'
          onFocus={() => clearErrors('title')}
        />

        <div className='flex'>
          <div className='bg-white rounded-lg px-3 flex items-center'>
            <FaPlay size={16} className='text-secondary' />
          </div>
          <input
            className='peer'
            type='checkbox'
            id='booted'
            hidden
            {...register('booted', { required: false })}
          />
          <label
            className='select-none cursor-pointer border border-green-500 px-4 py-2 rounded-lg common-transition bg-white text-green-500 peer-checked:bg-green-500 peer-checked:text-white'
            htmlFor='booted'>
            Booted
          </label>
        </div>

        {/* MARK: Add Button */}
        <LoadingButton
          className='mt-4 px-4 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-semibold common-transition'
          onClick={handleSubmit(onSubmit)}
          text='Add'
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddTagPage
