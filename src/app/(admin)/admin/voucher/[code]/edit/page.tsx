'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading, setPageLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { IVoucher } from '@/models/VoucherModel'
import { getRoleUsersApi, getVoucherApi, updateVoucherApi } from '@/requests'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowCircleLeft, FaMinus, FaQuoteRight, FaUserEdit, FaWindowMaximize } from 'react-icons/fa'
import { FaPause, FaPlay } from 'react-icons/fa6'

import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine, RiCheckboxMultipleBlankLine } from 'react-icons/ri'

function EditVoucherPage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const { code } = useParams<{ code: string }>()
  const router = useRouter()

  // states
  const [voucher, setVoucher] = useState<IVoucher | null>(null)
  const [roleUsers, setRoleUsers] = useState<IUser[]>([])

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      code: '',
      desc: '',
      begin: '',
      expire: '',
      minTotal: 0,
      maxReduce: '',
      type: 'fixed-reduce',
      value: '',
      timesLeft: 1,
      owner: '',
      active: true,
    },
  })

  // MARK: Get Data
  // get voucher by id
  useEffect(() => {
    const getVoucher = async () => {
      try {
        // send request to server to get voucher
        const { voucher } = await getVoucherApi(code) // no cache

        // set voucher to state
        setVoucher(voucher)

        // set value to form
        setValue('code', voucher.code)
        setValue('desc', voucher.desc)
        setValue('begin', new Date(voucher.begin).toISOString().split('T')[0])
        if (voucher.expire) {
          setValue('expire', new Date(voucher.expire).toISOString().split('T')[0])
        }
        setValue('minTotal', voucher.minTotal)
        setValue('maxReduce', voucher.maxReduce)
        setValue('type', voucher.type)
        setValue('value', voucher.value)
        setValue('timesLeft', voucher.timesLeft)
        setValue('owner', voucher.owner._id)
        setValue('active', voucher.active)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getVoucher()
  }, [code, setValue])

  // get roleUsers, admins, editors
  useEffect(() => {
    const getRoleUsers = async () => {
      try {
        // send request to server to get role-users
        const { roleUsers } = await getRoleUsersApi() // cache: no-store

        // set roleUsers to state
        setRoleUsers(roleUsers)
        setValue('owner', roleUsers.find((user: IUser) => user.role === 'admin')._id)
      } catch (err: any) {
        console.log(err)
      }
    }
    getRoleUsers()
  }, [setValue])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true
      // code >= 5
      if (data.code.length < 5) {
        setError('code', {
          type: 'manual',
          message: 'Code must be at least 5 characters',
        })
        isValid = false
      }

      // code < 10
      if (data.code.length > 10) {
        setError('code', {
          type: 'manual',
          message: 'Code must be at most 10 characters',
        })
        isValid = false
      }

      // begin < expire when expire is not empty
      if (data.expire && new Date(data.begin) > new Date(data.expire)) {
        setError('expire', {
          type: 'manual',
          message: 'Expire must be greater than begin',
        })
        isValid = false
      }

      // minTotal >= 0
      if (data.minTotal < 0) {
        setError('minTotal', {
          type: 'manual',
          message: 'Min total must be >= 0',
        })
        isValid = false
      }

      // maxReduce >= 0
      if (data.maxReduce < 0) {
        setError('maxReduce', {
          type: 'manual',
          message: 'Max reduce must be >= 0',
        })
        isValid = false
      }

      // timesLeft >= 0
      if (data.timesLeft < 0) {
        setError('timesLeft', {
          type: 'manual',
          message: 'Times left must be >= 0',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Submit
  // handle send request to server to add voucher
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      dispatch(setLoading(true))

      try {
        // send request to server to add voucher
        const { message } = await updateVoucherApi(code, data)

        // show success message
        toast.success(message)

        // reset form
        reset()
        dispatch(setPageLoading(false))

        // redirect back
        router.back()
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        dispatch(setLoading(false))
      }
    },
    [handleValidate, reset, dispatch, code, router]
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
      <AdminHeader title={`Edit Voucher: ${voucher?.code}`} backLink='/admin/voucher/all' />

      <div className='mt-5'>
        <div className='b-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {/* Code */}
          <Input
            id='code'
            label='Code'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='text'
            icon={RiCharacterRecognitionLine}
            onFocus={() => clearErrors('code')}
          />

          {/* Owner */}
          <Input
            id='owner'
            label='Owner'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='select'
            onFocus={() => clearErrors('owner')}
            options={roleUsers.map(user => ({
              value: user._id,
              label: `${user.firstName} ${user.lastName} - (${
                user.role.charAt(0).toUpperCase() + user.role.slice(1)
              })`,
              selected: user.role === 'admin',
            }))}
            icon={FaUserEdit}
            className='mb-5'
          />
        </div>

        {/* Description */}
        <Input
          id='desc'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          type='textarea'
          icon={FaQuoteRight}
          className='mb-5'
          onFocus={() => clearErrors('desc')}
        />

        {/* MARK: Begin - Expire */}
        <div className='mb-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
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
            onFocus={() => clearErrors('begin')}
          />

          {/* Expire */}
          <Input
            id='expire'
            label='Expire'
            disabled={isLoading}
            register={register}
            errors={errors}
            type='date'
            icon={FaPause}
            onFocus={() => clearErrors('expire')}
          />
        </div>

        {/* MARK: Min - Max */}
        <div className='mb-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {/* Min Total */}
          <Input
            id='minTotal'
            label='Min Total'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
            icon={FaMinus}
            onFocus={() => clearErrors('minTotal')}
          />

          {/* Max Reduce */}
          <Input
            id='maxReduce'
            label='Max Reduce'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
            icon={FaWindowMaximize}
            onFocus={() => clearErrors('maxReduce')}
          />
        </div>

        {/* MARK: Type - Value */}
        <div className='mb-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {/* Type */}
          <Input
            id='type'
            label='Type'
            disabled={isLoading}
            register={register}
            errors={errors}
            icon={RiCheckboxMultipleBlankLine}
            type='select'
            onFocus={() => clearErrors('type')}
            options={[
              {
                value: 'fixed-reduce',
                label: 'Fixed Reduce',
                selected: true,
              },
              {
                value: 'percentage',
                label: 'Percentage',
              },
              {
                value: 'fixed',
                label: 'Fixed',
              },
            ]}
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
            onFocus={() => clearErrors('value')}
          />
        </div>

        {/* Times Left */}
        <Input
          id='timesLeft'
          label='Times Left'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='number'
          icon={FaArrowCircleLeft}
          className='mb-5'
          onFocus={() => clearErrors('timesLeft')}
        />

        {/* Active */}
        <div className='flex'>
          <div className='bg-white rounded-lg px-3 flex items-center'>
            <FaPlay size={16} className='text-secondary' />
          </div>
          <input
            className='peer'
            type='checkbox'
            id='active'
            hidden
            {...register('active', { required: false })}
          />
          <label
            className={
              'select-none cursor-pointer border border-green-500 px-4 py-2 rounded-lg trans-200 peer-checked:bg-green-500 peer-checked:text-white bg-white text-green-500'
            }
            htmlFor='active'>
            Active
          </label>
        </div>

        {/* MARK: Save Button */}
        <LoadingButton
          className='mt-4 px-4 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-semibold trans-200'
          onClick={handleSubmit(onSubmit)}
          text='Save'
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default EditVoucherPage
