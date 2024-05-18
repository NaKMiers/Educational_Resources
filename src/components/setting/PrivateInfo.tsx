'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenAuthentication } from '@/libs/reducers/modalReducer'
import { updatePrivateInfoApi } from '@/requests'
import { capitalize } from '@/utils'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEyeSlash, FaSave } from 'react-icons/fa'
import { MdCancel, MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import Divider from '../Divider'
import Input from '../Input'

interface PrivateInfoProps {
  className?: string
}

function PrivateInfo({ className = '' }: PrivateInfoProps) {
  // hook
  const dispatch = useAppDispatch()
  const { data: session, update } = useSession()
  const authenticated = useAppSelector(state => state.modal.authenticated)
  const curUser: any = session?.user

  // states
  const [editMode, setEditMode] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      phone: '',
      newPassword: '',
    },
  })

  // auto fill data
  useEffect(() => {
    if (curUser?._id) {
      reset({
        email: curUser.email,
        phone: curUser.phone,
      })
    }
  }, [reset, curUser])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // new password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number
      if (data.newPassword.trim() && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(data.newPassword)) {
        setError('newPassword', {
          type: 'manual',
          message:
            'New password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // update personal info
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      console.log('data', data)

      // validate form
      if (!handleValidate(data)) return

      // start loading
      setLoading(true)

      try {
        const { message } = await updatePrivateInfoApi(data)

        // notify success
        toast.success(message)

        // hide edit mode
        setEditMode(false)

        // update user session
        await update()
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop loading
        setLoading(false)
      }
    },
    [update, handleValidate, setLoading]
  )

  return (
    <div
      className={`relative rounded-lg border border-dark shadow-lg py-8 overflow-x-scroll ${className}`}>
      <div className='absolute font-semibold text-2xl w-[calc(100%_-_20px)] left-1/2 -translate-x-1/2 h-0.5 bg-slate-700'>
        <span className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-sm bg-white px-2 py-1 rounded-lg text-center'>
          Private Information
        </span>
      </div>

      <Divider size={6} />

      <div className='relative grid grid-cols-3 p-5 gap-21'>
        <div className='flex items-center justify-center gap-2 absolute -top-4 right-2'>
          {!editMode ? (
            <button
              className='flex gap-1 items-center justify-center rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white trans-2000'
              onClick={() =>
                curUser?.authType === 'local'
                  ? !authenticated
                    ? dispatch(setOpenAuthentication(true))
                    : setEditMode(true)
                  : setEditMode(true)
              }>
              <MdEdit size={20} />
              <span className='font-semibold'>Edit</span>
            </button>
          ) : (
            <>
              <button
                className={`flex gap-1 items-center justify-center rounded-lg border group border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white trans-200 ${
                  loading ? 'pointer-events-none' : 'cursor-pointer'
                }`}
                onClick={handleSubmit(onSubmit)}>
                {loading ? (
                  <RiDonutChartFill size={23} className='animate-spin text-slate-400' />
                ) : (
                  <>
                    <FaSave size={18} className='wiggle' />
                    <span className='font-semibold'>Save</span>
                  </>
                )}
              </button>

              <button
                className={`flex gap-1 items-center justify-center rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white trans-200 ${
                  loading ? 'pointer-events-none' : 'cursor-pointer'
                }`}
                onClick={() => setEditMode(false)}>
                <MdCancel size={20} />
                <span className='font-semibold'>Cancel</span>
              </button>
            </>
          )}
        </div>

        <div className='col-span-3 md:col-span-1'>
          {!editMode ? (
            <>
              <p className='text-slate-500'>Email</p>
              <p>{getValues('email')}</p>
            </>
          ) : (
            <Input
              id='email'
              label='Email'
              disabled={false}
              register={register}
              errors={errors}
              required
              type='email'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('email')}
            />
          )}
        </div>
        <div className='col-span-3 md:col-span-1'>
          {!editMode ? (
            <>
              <p className='text-slate-500'>Phone</p>
              <p>{getValues('phone') || <span className='text-slate-300'>Empty</span>}</p>
            </>
          ) : (
            <Input
              id='phone'
              label='Phone'
              disabled={false}
              register={register}
              errors={errors}
              type='number'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('phone')}
            />
          )}
        </div>
        {curUser?.authType === 'local' && (
          <div className='col-span-3 md:col-span-1'>
            {!editMode ? (
              <>
                <p className='text-slate-500'>Password</p>
                <p>*********</p>
              </>
            ) : (
              <Input
                id='newPassword'
                label='Change New Password'
                disabled={false}
                register={register}
                errors={errors}
                icon={FaEyeSlash}
                type='password'
                labelBg='bg-white'
                className='min-w-[40%] mt-3'
                onFocus={() => clearErrors('newPassword')}
              />
            )}
          </div>
        )}
        <div className='col-span-3 md:col-span-1'>
          <p className='text-slate-500'>Role</p>
          <p>{capitalize(curUser?.role || '')}</p>
        </div>
      </div>
    </div>
  )
}

export default PrivateInfo
