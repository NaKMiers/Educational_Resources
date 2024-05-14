'use client'

import Divider from '@/components/Divider'
import { changeNotificationSettingApi, checkAuthenticationApi } from '@/requests'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch, FaSave } from 'react-icons/fa'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { IoWarningOutline } from 'react-icons/io5'
import { MdCancel, MdEdit } from 'react-icons/md'
import { capitalize } from '@/utils'

function PersonalSetting() {
  // hook
  const { data: session, update } = useSession()
  const curUser: any = session?.user
  console.log('curUser', curUser)

  // states
  // authentication
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [isCheckingAuthentication, setIsCheckingAuthentication] = useState<boolean>(false)
  const [openCheckAuthenticationModal, setOpenCheckAuthenticationModal] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')

  // edit
  const [editPersonalInfoMode, setEditPersonalInfoMode] = useState<boolean>(false)
  const [editPrivateInfoMode, setEditPrivateInfoMode] = useState<boolean>(false)

  const [personalInfo, setPersonalInfo] = useState<any>({
    firstName: '',
    lastName: '',
    birthday: '',
    job: '',
    bio: '',
  })

  const [privateInfo, setPrivateInfo] = useState<any>({
    email: '',
    phone: '',
    password: '',
  })

  // notification settings
  const [userNotificationSettings, setUserNotificationSettings] = useState<any>({
    newLesson: false,
    repliedQuestion: false,
    emotionQuestion: false,
    repliedComment: false,
    emotionComment: false,
  })

  // auto update initials states
  useEffect(() => {
    if (curUser?._id && curUser.notificationSettings) {
      setUserNotificationSettings({
        ...curUser.notificationSettings,
      })

      setPersonalInfo({
        firstName: curUser.firstName,
        lastName: curUser.lastName,
        birthday: curUser.birthday,
        job: curUser.job,
        bio: curUser.bio,
      })

      setPrivateInfo({
        email: curUser.email,
        phone: curUser.phone,
        password: '',
      })
    }
  }, [curUser?._id, curUser])

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
      setAuthenticated(true)

      // reset password
      setPassword('')

      // notify success
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsCheckingAuthentication(false)
      setOpenCheckAuthenticationModal(false)
    }
  }, [password])

  // handle change notification settings
  const handleChangeNotificationSetting = useCallback(
    async (type: string) => {
      if (!curUser?._id) {
        toast.error('User not found!')
        return
      }

      try {
        const { value, message } = await changeNotificationSettingApi(
          type,
          !userNotificationSettings[type]
        )

        // notify sucecss
        toast.success(message)

        // update user session
        await update()
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    [update, curUser?._id, userNotificationSettings]
  )

  console.log('openCheckAuthenticationModal', openCheckAuthenticationModal)

  return (
    <div className='max-w-1200 mx-auto px-21'>
      <Divider size={8} />

      {/* MARK: Account Infomation */}
      <div className='relative rounded-lg border border-dark shadow-lg p-4'>
        <div className='flex gap-2'>
          <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
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
      <div className='relative rounded-lg border border-dark shadow-lg py-8'>
        <div className='absolute font-semibold text-2xl w-[calc(100%_-_20px)] left-1/2 -translate-x-1/2 h-0.5 bg-slate-700'>
          <span className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-sm bg-white px-2 py-1 rounded-lg text-center'>
            Personal Information
          </span>
        </div>

        <Divider size={6} />

        <div className='relative grid grid-cols-3 p-5 gap-21'>
          <div className='flex items-center justify-center gap-2 absolute -top-4 right-2'>
            {!editPersonalInfoMode ? (
              <button
                className='flex gap-1 items-center justify-center rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'
                onClick={() =>
                  curUser?.authType === 'local'
                    ? !authenticated
                      ? setOpenCheckAuthenticationModal(true)
                      : setEditPersonalInfoMode(true)
                    : setEditPersonalInfoMode(true)
                }>
                <MdEdit size={20} />
                <span className='font-semibold'>Edit</span>
              </button>
            ) : (
              <>
                <button
                  className='flex gap-1 items-center justify-center rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'
                  onClick={() => {}}>
                  <FaSave size={20} />
                  <span className='font-semibold'>Save</span>
                </button>

                <button
                  className='flex gap-1 items-center justify-center rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'
                  onClick={() => setEditPersonalInfoMode(false)}>
                  <MdCancel size={20} />
                  <span className='font-semibold'>Cancel</span>
                </button>
              </>
            )}
          </div>

          <div className='col-span-3 md:col-span-1 font-semibold'>
            {!editPersonalInfoMode ? (
              <>
                <p className='text-slate-500'>First Name</p>
                <p>{personalInfo.firstName || <span className='text-slate-300'>Empty</span>}</p>
              </>
            ) : (
              <input
                type='text'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='rounded-md shadow-lg w-full px-4 py-1 bg-slate-200 outline-none mt-1'
                placeholder='First Name...'
              />
            )}
          </div>
          <div className='col-span-3 md:col-span-1 font-semibold'>
            {!editPersonalInfoMode ? (
              <>
                <p className='text-slate-500'>Last Name</p>
                <p>{personalInfo.lastName || <span className='text-slate-300'>Empty</span>}</p>
              </>
            ) : (
              <input
                type='text'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='rounded-md shadow-lg w-full px-4 py-1 bg-slate-200 outline-none mt-1'
                placeholder='Last Name...'
              />
            )}
          </div>
          <div className='col-span-3 md:col-span-1 font-semibold'>
            {!editPersonalInfoMode ? (
              <>
                <p className='text-slate-500'>Birthday</p>
                <p>{personalInfo.birthday || <span className='text-slate-300'>Empty</span>}</p>
              </>
            ) : (
              <input
                type='date'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='rounded-md shadow-lg w-full px-4 py-1 bg-slate-200 outline-none mt-1'
                placeholder='Birthday...'
              />
            )}
          </div>
          <div className='col-span-3 md:col-span-1 font-semibold'>
            {!editPersonalInfoMode ? (
              <>
                <p className='text-slate-500'>Job</p>
                <p>{personalInfo.job || <span className='text-slate-300'>Empty</span>}</p>
              </>
            ) : (
              <input
                type='text'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='rounded-md shadow-lg w-full px-4 py-1 bg-slate-200 outline-none mt-1'
                placeholder='Job...'
              />
            )}
          </div>
          <div className='col-span-3 md:col-span-1 font-semibold'>
            {!editPersonalInfoMode ? (
              <>
                <p className='text-slate-500'>Bio</p>
                <p>{personalInfo.bio || <span className='text-slate-300'>Empty</span>}</p>
              </>
            ) : (
              <textarea
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='rounded-md shadow-lg w-full px-4 py-1 bg-slate-200 outline-none mt-1'
                placeholder='Bio...'
              />
            )}
          </div>
        </div>
      </div>

      <Divider size={8} />

      {/* MARK: Private Information */}
      <div className='relative rounded-lg border border-dark shadow-lg py-8'>
        <div className='absolute font-semibold text-2xl w-[calc(100%_-_20px)] left-1/2 -translate-x-1/2 h-0.5 bg-slate-700'>
          <span className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-sm bg-white px-2 py-1 rounded-lg text-center'>
            Private Information
          </span>
        </div>

        <Divider size={6} />

        <div className='relative grid grid-cols-3 p-5 gap-21'>
          <div className='flex items-center justify-center gap-2 absolute -top-4 right-2'>
            {!editPrivateInfoMode ? (
              <button
                className='flex gap-1 items-center justify-center rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'
                onClick={() =>
                  curUser?.authType === 'local'
                    ? !authenticated
                      ? setOpenCheckAuthenticationModal(true)
                      : setEditPrivateInfoMode(true)
                    : setEditPrivateInfoMode(true)
                }>
                <MdEdit size={20} />
                <span className='font-semibold'>Edit</span>
              </button>
            ) : (
              <>
                <button
                  className='flex gap-1 items-center justify-center rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'
                  onClick={() => {}}>
                  <FaSave size={20} />
                  <span className='font-semibold'>Save</span>
                </button>

                <button
                  className='flex gap-1 items-center justify-center rounded-lg border border-dark shadow-lg bg-slate-200 px-2 py-1 hover:bg-white common-transition'
                  onClick={() => setEditPrivateInfoMode(false)}>
                  <MdCancel size={20} />
                  <span className='font-semibold'>Cancel</span>
                </button>
              </>
            )}
          </div>

          <div className='col-span-3 md:col-span-1 font-semibold'>
            {!editPrivateInfoMode ? (
              <>
                <p className='text-slate-500'>Email</p>
                <p>{privateInfo.email}</p>
              </>
            ) : (
              <input
                type='email'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='rounded-md shadow-lg w-full px-4 py-1 bg-slate-200 outline-none mt-1'
                placeholder='Email...'
              />
            )}
          </div>
          <div className='col-span-3 md:col-span-1 font-semibold'>
            {!editPrivateInfoMode ? (
              <>
                <p className='text-slate-500'>Phone</p>
                <p>{privateInfo.phone || <span className='text-slate-300'>Empty</span>}</p>
              </>
            ) : (
              <input
                type='text'
                value={password}
                onChange={e => /^\d*$/.test(e.target.value) && setPassword(e.target.value)}
                className='rounded-md shadow-lg w-full px-4 py-1 bg-slate-200 outline-none mt-1'
                placeholder='Phone...'
              />
            )}
          </div>
          {curUser?.authType === 'local' && (
            <div className='col-span-3 md:col-span-1 font-semibold'>
              {!editPrivateInfoMode ? (
                <>
                  <p className='text-slate-500'>Password</p>
                  <p>*********</p>
                </>
              ) : (
                <input
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className='rounded-md shadow-lg w-full px-4 py-1 bg-slate-200 outline-none mt-1'
                  placeholder='Phone...'
                />
              )}
            </div>
          )}
          <div className='col-span-3 md:col-span-1 font-semibold'>
            <p className='text-slate-500'>Role</p>
            <p>{capitalize(curUser?.role || '')}</p>
          </div>
        </div>
      </div>

      <Divider size={8} />

      {/* MARK: Notification Setting */}
      <div className='relative rounded-lg border border-dark shadow-lg py-8'>
        <div className='absolute font-semibold text-2xl w-[calc(100%_-_20px)] left-1/2 -translate-x-1/2 h-0.5 bg-slate-700'>
          <span className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-sm bg-white px-2 py-1 rounded-lg text-center'>
            Notification Settings
          </span>
        </div>

        <Divider size={5} />

        <div className='p-5'>
          <p className='font-semibold'>Send me nofification when:</p>

          <Divider size={4} />

          <ul className='max-w-[500px] w-full pl-20 flex flex-col gap-4'>
            <li className='flex items-center justify-between gap-4'>
              <span>New Lesson</span>

              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={userNotificationSettings.newLesson}
                  onChange={() => handleChangeNotificationSetting('newLesson')}
                  className='sr-only peer'
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </li>
            <li className='flex items-center justify-between gap-4'>
              <span>Replied Question</span>

              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={userNotificationSettings.repliedQuestion}
                  onChange={() => handleChangeNotificationSetting('repliedQuestion')}
                  className='sr-only peer'
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </li>
            <li className='flex items-center justify-between gap-4'>
              <span>Emotion Question</span>

              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={userNotificationSettings.emotionQuestion}
                  onChange={() => handleChangeNotificationSetting('emotionQuestion')}
                  className='sr-only peer'
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </li>
            <li className='flex items-center justify-between gap-4'>
              <span>Replied Comment</span>

              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={userNotificationSettings.repliedComment}
                  onChange={() => handleChangeNotificationSetting('repliedComment')}
                  className='sr-only peer'
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </li>
            <li className='flex items-center justify-between gap-4'>
              <span>Emotion Comment</span>

              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={userNotificationSettings.emotionComment}
                  onChange={() => handleChangeNotificationSetting('emotionComment')}
                  className='sr-only peer'
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </li>
          </ul>
        </div>
      </div>

      <Divider size={16} />

      {/* Check Authentication */}
      <div
        className={`${
          openCheckAuthenticationModal ? 'block' : 'hidden'
        } flex items-center justify-center fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50`}
        onClick={() => setOpenCheckAuthenticationModal(false)}>
        <div
          className='flex flex-col items-center relative rounded-lg shadow-lg max-w-[500px] w-full bg-white p-21'
          onClick={e => e.stopPropagation()}>
          {/* Close Button */}
          <button
            className='absolute top-3 right-3 group'
            onClick={() => setOpenCheckAuthenticationModal(false)}>
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
            className={`h-8 flex items-center justify-center rounded-lg shadow-lg px-4 py-1 text-slate-500 bg-slate-200 hover:bg-white common-transition ${
              isCheckingAuthentication ? 'bg-slate-200 pointer-events-none' : ''
            }`}>
            {isCheckingAuthentication ? (
              <FaCircleNotch
                size={18}
                className='text-slate-500 group-hover:text-dark common-transition animate-spin'
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
