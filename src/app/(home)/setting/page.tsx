'use client'

import Divider from '@/components/Divider'
import NotificationSettings from '@/components/setting/NotificationSettings'
import PersonalInfo from '@/components/setting/PersonalInfo'
import PrivateInfo from '@/components/setting/PrivateInfo'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setAuthenticated, setOpenAuthentication } from '@/libs/reducers/modalReducer'
import { checkAuthenticationApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { IoWarningOutline } from 'react-icons/io5'

function PersonalSetting() {
  // hook
  const { data: session } = useSession()
  const curUser: any = session?.user
  const dispatch = useAppDispatch()
  const openAuthentication = useAppSelector(state => state.modal.openAuthentication)

  // states
  // authentication
  const [isCheckingAuthentication, setIsCheckingAuthentication] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')

  // handle check authentication
  const handleCheckAuthentication = useCallback(async () => {
    if (!password.trim()) {
      toast.error('Password is required!')
      return
    }

    // start loading
    setIsCheckingAuthentication(true)

    try {
      // send request to server to check authentication
      const { message } = await checkAuthenticationApi(password)

      // set authenticated
      dispatch(setAuthenticated(true))

      // reset password
      setPassword('')

      // close modal
      dispatch(setOpenAuthentication(false))

      // notify success
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsCheckingAuthentication(false)
    }
  }, [dispatch, password])

  return (
    <div className='max-w-1200 mx-auto px-21'>
      <Divider size={8} />

      {/* MARK: Account Infomation */}
      <div className='relative rounded-lg border border-dark shadow-lg p-4 overflow-x-scroll'>
        <div className='flex gap-2'>
          <div className='flex-shrink-0 w-[50px] h-[50px] rounded-full overflow-hidden'>
            <Image
              src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
              width={80}
              height={80}
              alt='avatar'
            />
          </div>
          <div className='font-body tracking-wider'>
            <p className='font-semibold text-xl'>
              {curUser?.firstName && curUser?.lastName
                ? `${curUser.firstName} ${curUser.lastName}`
                : curUser?.username}
            </p>
            <p> {curUser?.email}</p>
            <p>{curUser?.phone}</p>
            <p>{curUser?.address}</p>
          </div>
        </div>
      </div>

      <Divider size={8} />

      {/* MARK: Personal Information */}
      <PersonalInfo />

      <Divider size={8} />

      {/* MARK: Private Information */}
      <PrivateInfo />

      <Divider size={8} />

      {/* MARK: Notification Setting */}
      <NotificationSettings />

      <Divider size={16} />

      {/* Check Authentication */}
      <div
        className={`${
          openAuthentication ? 'block' : 'hidden'
        } flex items-center justify-center fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50`}
        onClick={() => dispatch(setOpenAuthentication(false))}>
        <div
          className='flex flex-col items-center relative rounded-lg shadow-lg max-w-[500px] w-full bg-white p-21'
          onClick={e => e.stopPropagation()}>
          {/* Close Button */}
          <button
            className='absolute top-3 right-3 group'
            onClick={() => dispatch(setOpenAuthentication(false))}>
            <IoMdCloseCircleOutline size={22} className='wiggle' />
          </button>
          <p className='flex items-center justify-center gap-1'>
            <IoWarningOutline size={18} />
            <span>Please enter your password</span>
          </p>

          <Divider size={4} />

          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='rounded-lg shadow-lg w-full px-4 py-1 bg-slate-200 outline-none'
            placeholder='Password...'
          />

          <Divider size={4} />

          <button
            onClick={handleCheckAuthentication}
            disabled={isCheckingAuthentication}
            className={`h-8 flex items-center justify-center rounded-lg shadow-lg px-4 py-1 text-slate-500 bg-slate-200 hover:bg-white trans-200 ${
              isCheckingAuthentication ? 'bg-slate-200 pointer-events-none' : ''
            }`}>
            {isCheckingAuthentication ? (
              <FaCircleNotch
                size={18}
                className='text-slate-500 group-hover:text-dark trans-200 animate-spin'
              />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PersonalSetting
