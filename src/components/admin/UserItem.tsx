import { IUser } from '@/models/UserModel'
import { demoteCollaboratorApi, rechargeUserApi, setCollaboratorApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { formatDate, formatTime } from '@/utils/time'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaPlusCircle, FaTrash } from 'react-icons/fa'
import { GrUpgrade } from 'react-icons/gr'
import { HiLightningBolt } from 'react-icons/hi'
import { RiCheckboxMultipleBlankLine, RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'
import Input from '../Input'
import LoadingButton from '../LoadingButton'

interface UserItemProps {
  data: IUser
  loadingUsers: string[]
  className?: string

  selectedUsers: string[]
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>

  handleDeleteUsers: (ids: string[]) => void
}

function UserItem({
  data,
  loadingUsers,
  className = '',
  // selected
  selectedUsers,
  setSelectedUsers,
  // functions
  handleDeleteUsers,
}: UserItemProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [userData, setUserData] = useState<IUser>(data)
  const [isOpenRecharge, setIsOpenRecharge] = useState<boolean>(false)
  const [isLoadingRecharge, setIsLoadingRecharge] = useState<boolean>(false)
  const [isOpenSetCollaborator, setIsOpenSetCollaborator] = useState<boolean>(false)
  const [isLoadingSetCollaborator, setIsLoadingSetCollaborator] = useState<boolean>(false)
  const [isDemoting, setIsDemoting] = useState<boolean>(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [isOpenDemoteCollboratorConfirmationDialog, setIsOpenDemoteCollboratorConfirmationDialog] =
    useState<boolean>(false)

  // values
  const isCurUser = data._id === curUser?._id

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      recharge: '',
      type: 'percentage',
      ['value-' + data._id]: '10%',
    },
  })

  // MARK: Handlers
  // submit recharge form
  const onRechargeSubmit: SubmitHandler<FieldValues> = async formData => {
    setIsLoadingRecharge(true)

    try {
      // send request to server
      const { user, message } = await rechargeUserApi(userData._id, formData.recharge)

      // update user data
      setUserData(user)

      // show success message
      toast.success(message)

      // reset
      reset()
      setIsOpenRecharge(false)
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.userData.message)
    } finally {
      setIsLoadingRecharge(false)
    }
  }

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    formData => {
      let isValid = true

      // if type if percentage, value must have '%' at the end
      if (formData.type === 'percentage' && !formData['value-' + data._id].endsWith('%')) {
        setError('value-' + data._id, { type: 'manual', message: 'Value must have %' })
        isValid = false
      }

      // if type if percentage, value have '%' at the end and must be number
      if (formData.type === 'percentage' && isNaN(Number(formData['value-' + data._id].slice(0, -1)))) {
        setError('value-' + data._id, { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      // if type if fixed-reduce, value must be number
      if (formData.type !== 'percentage' && isNaN(Number(formData['value-' + data._id]))) {
        setError('value-' + data._id, { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      return isValid
    },
    [setError, data._id]
  )

  // submit collaborator form
  const onSetCollaboratorSubmit: SubmitHandler<FieldValues> = async formData => {
    // validate form
    if (!handleValidate(formData)) return

    setIsLoadingSetCollaborator(true)

    try {
      // send request to server
      const { user, message } = await setCollaboratorApi(
        userData._id,
        formData.type,
        formData['value-' + data._id]
      )

      // update user data
      setUserData(user)

      // show success message
      toast.success(message)

      // reset
      reset()
      setIsOpenSetCollaborator(false)
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.userData.message)
    } finally {
      setIsLoadingSetCollaborator(false)
    }
  }

  // handle demote collaborator
  const handleDemoteCollaborator = useCallback(async () => {
    setIsDemoting(true)

    try {
      // send request to server
      const { user, message } = await demoteCollaboratorApi(data._id)

      // update user data
      setUserData(user)

      // show success message
      toast.success(message)

      // reset
      reset()
      setIsOpenSetCollaborator(false)
    } catch (err: any) {
      toast.error(err.response.userData.message)
    } finally {
      setIsDemoting(false)
    }
  }, [data._id, reset])

  return (
    <>
      <div
        className={`relative flex text-dark justify-between items-start gap-2 p-4 rounded-lg shadow-lg common-transition select-none  ${
          selectedUsers.includes(userData._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        } ${!isCurUser ? 'cursor-pointer' : ''} ${className}`}
        onClick={() =>
          !isCurUser &&
          setSelectedUsers(prev =>
            prev.includes(userData._id)
              ? prev.filter(id => id !== userData._id)
              : [...prev, userData._id]
          )
        }>
        {/* MARK: Body */}
        <div>
          {/* Avatar */}
          <Image
            className='aspect-square float-start mr-3 rounded-md'
            src={userData.avatar}
            height={65}
            width={65}
            alt='thumbnail'
            title={userData._id}
          />

          {/* Infomation */}
          <div className='absolute z-30 -top-2 -left-2 shadow-md text-xs text-yellow-300 bg-secondary px-2 py-[2px] select-none rounded-lg font-body'>
            {userData.role}
          </div>
          <p
            className='block font-semibold text-[18px] font-body tracking-wide text-secondary text-ellipsis line-clamp-1'
            title={userData.email}>
            {userData.email}
          </p>
          <div className='flex items-center gap-2 text-sm'>
            <p>
              <span className='font-semibold'>Expended: </span>
              <span className='text-green-500'>{formatPrice(userData.expended)}</span>
            </p>
          </div>
          {userData.username && (
            <p className='text-sm'>
              <span className='font-semibold'>Username: </span>
              <span>{userData.username}</span>
            </p>
          )}
          {(userData.firstName || userData.lastName) && (
            <p className='text-sm'>
              <span className='font-semibold'>Fullname: </span>
              <span>{userData.firstName + ' ' + userData.lastName}</span>
            </p>
          )}
          {userData.birthday && (
            <p className='text-sm'>
              <span className='font-semibold'>Birthday: </span>
              <span>{formatDate(userData.birthday)}</span>
            </p>
          )}
          {userData.phone && (
            <p className='text-sm'>
              <span className='font-semibold'>Phone: </span>
              <span>{userData.phone}</span>
            </p>
          )}
          {userData.address && (
            <p className='text-sm'>
              <span className='font-semibold'>Address: </span>
              <span>{userData.address}</span>
            </p>
          )}
          {userData.job && (
            <p className='text-sm'>
              <span className='font-semibold'>Job: </span>
              <span>{userData.job}</span>
            </p>
          )}
          <p className='text-sm'>
            <span className='font-semibold'>Created At: </span>
            <span
              className={`${
                +new Date() - +new Date(data.createdAt) <= 60 * 60 * 1000 ? 'text-yellow-500' : ''
              }`}>
              {formatTime(userData.createdAt)}
            </span>
          </p>
          <p className='text-sm'>
            <span className='font-semibold'>Updated At: </span>
            <span
              className={`${
                +new Date() - +new Date(data.updatedAt) <= 60 * 60 * 1000 ? 'text-yellow-500' : ''
              }`}>
              {formatTime(userData.updatedAt)}
            </span>
          </p>
        </div>

        {/* MARK: Recharge Modal */}
        {isOpenRecharge && (
          <div
            className='absolute z-20 p-21 top-0 left-0 w-full h-full flex items-center justify-center gap-2 rounded-md bg-secondary bg-opacity-80'
            onClick={e => {
              e.stopPropagation()
              setIsOpenRecharge(false)
            }}>
            <Input
              id='recharge'
              label='Recharge'
              disabled={isLoadingRecharge}
              register={register}
              errors={errors}
              required
              type='number'
              icon={HiLightningBolt}
              className='w-full shadow-lg'
              onClick={e => e.stopPropagation()}
              onFocus={() => clearErrors('recharge')}
            />
            <LoadingButton
              className='px-4 h-[46px] shadow-lg flex items-center justify-center bg-secondary hover:bg-primary text-white rounded-lg font-semibold common-transition'
              text='Add'
              onClick={e => {
                e.stopPropagation()
                handleSubmit(onRechargeSubmit)(e)
              }}
              isLoading={isLoadingRecharge}
            />
          </div>
        )}

        {/* MARK: Set Collaborator Modal */}
        {isOpenSetCollaborator && (
          <div
            className='absolute z-20 p-21 top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-2 rounded-md bg-yellow-400 bg-opacity-80'
            onClick={e => {
              e.stopPropagation()
              setIsOpenSetCollaborator(false)
            }}>
            {/* Type */}
            <Input
              id='type'
              label='Type'
              disabled={isLoadingSetCollaborator}
              register={register}
              errors={errors}
              icon={RiCheckboxMultipleBlankLine}
              type='select'
              className='w-full'
              onClick={e => e.stopPropagation()}
              onFocus={() => clearErrors('type')}
              options={[
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
            <div className='flex w-full gap-2 items-center'>
              <Input
                id={'value-' + data._id}
                label='Commission'
                disabled={isLoadingSetCollaborator}
                register={register}
                errors={errors}
                required
                type='text'
                icon={HiLightningBolt}
                className='w-full shadow-lg'
                onClick={e => e.stopPropagation()}
                onFocus={() => clearErrors('value-' + data._id)}
              />
              <LoadingButton
                className='px-4 h-[46px] flex items-center justify-center shadow-lg bg-secondary hover:bg-primary text-white rounded-lg font-semibold common-transition'
                text='Set'
                onClick={e => {
                  e.stopPropagation()
                  handleSubmit(onSetCollaboratorSubmit)(e)
                }}
                isLoading={isLoadingSetCollaborator}
              />
            </div>
          </div>
        )}

        {/* MARK: Action Buttons*/}
        {!isCurUser && (
          <div className='flex flex-col border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
            {/* Promote User Button */}
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
                userData.role === 'collaborator'
                  ? setIsOpenDemoteCollboratorConfirmationDialog(true)
                  : setIsOpenSetCollaborator(true)
              }}
              disabled={loadingUsers.includes(userData._id) || isDemoting}
              title={userData.role === 'collaborator' ? 'Demote' : 'Promote'}>
              {isDemoting ? (
                <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
              ) : (
                <GrUpgrade
                  size={18}
                  className={`wiggle ${
                    userData.role === 'collaborator' ? 'rotate-180 text-red-500' : ''
                  }`}
                />
              )}
            </button>

            {/* Add Balance Button */}
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
                setIsOpenRecharge(true)
              }}
              disabled={loadingUsers.includes(userData._id) || isDemoting}
              title='Recharge'>
              <FaPlusCircle size={18} className='wiggle' />
            </button>

            {/* Delete Button */}
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
                setIsOpenConfirmModal(true)
              }}
              disabled={loadingUsers.includes(userData._id) || isDemoting}
              title='Delete'>
              {loadingUsers.includes(userData._id) ? (
                <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
              ) : (
                <FaTrash size={18} className='wiggle' />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete User'
        content='Are you sure that you want to delete this user?'
        onAccept={() => handleDeleteUsers([data._id])}
        isLoading={loadingUsers.includes(data._id)}
      />

      {/* Confirm Demote Collaborator Dialog */}
      <ConfirmDialog
        open={isOpenDemoteCollboratorConfirmationDialog}
        setOpen={setIsOpenDemoteCollboratorConfirmationDialog}
        title='Demote Collaborator'
        content='Are you sure that you want to  this collaborator?'
        onAccept={handleDemoteCollaborator}
        isLoading={isDemoting}
      />
    </>
  )
}

export default UserItem
