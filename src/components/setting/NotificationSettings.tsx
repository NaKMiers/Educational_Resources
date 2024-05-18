'use client'

import { changeNotificationSettingApi } from '@/requests'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Divider from '../Divider'

interface NotificationSettingsProps {
  className?: string
}

function NotificationSettings({ className = '' }: NotificationSettingsProps) {
  // hook
  const { data: session, update } = useSession()
  const curUser: any = session?.user

  // states
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
    }
  }, [curUser?._id, curUser])

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

  return (
    <div
      className={`relative rounded-lg border border-dark shadow-lg py-8 overflow-x-scroll ${className}`}>
      <div className='absolute font-semibold text-2xl w-[calc(100%_-_20px)] left-1/2 -translate-x-1/2 h-0.5 bg-slate-700'>
        <span className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-sm bg-white px-2 py-1 rounded-lg text-center'>
          Notification Settings
        </span>
      </div>

      <Divider size={5} />

      <div className='p-5'>
        <p className='font-semibold'>Send me nofification when:</p>

        <Divider size={4} />

        <ul className='max-w-[500px] w-full pl-21 md:pl-20 flex flex-col gap-4'>
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
  )
}

export default NotificationSettings
