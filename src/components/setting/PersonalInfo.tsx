'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenAuthentication } from '@/libs/reducers/modalReducer'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FaSave } from 'react-icons/fa'
import { MdCancel, MdEdit } from 'react-icons/md'
import Divider from '../Divider'
import Input from '../Input'
import toast from 'react-hot-toast'
import { updatePersonalInfoApi } from '@/requests'
import { RiDonutChartFill } from 'react-icons/ri'

interface PersonalInfoProps {
  className?: string
}

function PersonalInfo({ className = '' }: PersonalInfoProps) {
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
      firstName: '',
      lastName: '',
      birthday: '',
      job: '',
      bio: '',
    },
  })

  // auto fill data
  useEffect(() => {
    if (curUser?._id) {
      reset({
        firstName: curUser.firstName,
        lastName: curUser.lastName,
        birthday: curUser.birthday ? new Date(curUser.birthday).toISOString().split('T')[0] : '',
        job: curUser.job,
        bio: curUser.bio,
      })
    }
  }, [reset, curUser])

  console.log(getValues())

  // update personal info
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // start loading
      setLoading(true)

      try {
        const { message } = await updatePersonalInfoApi(data)

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
    [update]
  )

  return (
    <div
      className={`relative rounded-lg border border-dark shadow-lg py-8 overflow-x-scroll ${className}`}>
      <div className='absolute font-semibold text-2xl w-[calc(100%_-_20px)] left-1/2 -translate-x-1/2 h-0.5 bg-slate-700'>
        <span className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-sm bg-white px-2 py-1 rounded-lg text-center'>
          Personal Information
        </span>
      </div>

      <Divider size={6} />

      <div className='relative grid grid-cols-3 p-5 gap-21'>
        <div className='flex items-center justify-center gap-2 absolute -top-4 right-2'>
          {!editMode ? (
            <button
              className='flex gap-1 items-center justify-center rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'
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
                className='flex gap-1 items-center justify-center rounded-lg border group border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'
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
                className='flex gap-1 items-center justify-center rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'
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
              <p className='text-slate-500'>First Name</p>
              <p>{getValues('firstName') || <span className='text-slate-300'>Empty</span>}</p>
            </>
          ) : (
            <Input
              id='firstName'
              label='First Name'
              disabled={loading}
              register={register}
              errors={errors}
              type='text'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('firstName')}
            />
          )}
        </div>
        <div className='col-span-3 md:col-span-1'>
          {!editMode ? (
            <>
              <p className='text-slate-500'>Last Name</p>
              <p>{getValues('lastName') || <span className='text-slate-300'>Empty</span>}</p>
            </>
          ) : (
            <Input
              id='lastName'
              label='Last Name'
              disabled={loading}
              register={register}
              errors={errors}
              type='text'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('lastName')}
            />
          )}
        </div>
        <div className='col-span-3 md:col-span-1'>
          {!editMode ? (
            <>
              <p className='text-slate-500'>Birthday</p>
              <p>
                {(getValues('birthday') &&
                  new Date(getValues('birthday')).toISOString().split('T')[0]) || (
                  <span className='text-slate-300'>Empty</span>
                )}
              </p>
            </>
          ) : (
            <Input
              id='birthday'
              label='Birthday'
              disabled={loading}
              register={register}
              errors={errors}
              min={new Date('01/01/1910').toISOString().split('T')[0]}
              max={new Date().toISOString().split('T')[0]}
              type='date'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('birthday')}
            />
          )}
        </div>
        <div className='col-span-3 md:col-span-1'>
          {!editMode ? (
            <>
              <p className='text-slate-500'>Job</p>
              <p>{getValues('job') || <span className='text-slate-300'>Empty</span>}</p>
            </>
          ) : (
            <Input
              id='job'
              label='Job'
              disabled={loading}
              register={register}
              errors={errors}
              type='text'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('job')}
            />
          )}
        </div>
        <div className='col-span-3 md:col-span-1'>
          {!editMode ? (
            <>
              <p className='text-slate-500'>Bio</p>
              <p>{getValues('bio') || <span className='text-slate-300'>Empty</span>}</p>
            </>
          ) : (
            <Input
              id='bio'
              label='Bio'
              disabled={loading}
              register={register}
              errors={errors}
              type='textarea'
              labelBg='bg-white'
              className='min-w-[40%] mt-3'
              onFocus={() => clearErrors('bio')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalInfo
