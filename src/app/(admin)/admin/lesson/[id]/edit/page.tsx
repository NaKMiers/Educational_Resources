'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FaCheck, FaInfo } from 'react-icons/fa'

import AdminHeader from '@/components/admin/AdminHeader'
import { setLoading, setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { ILesson } from '@/models/LessonModel'
import { getForceAllCoursesApi, getLessonApi, updateLessonApi } from '@/requests'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { MdCategory } from 'react-icons/md'

export type GroupTypes = {
  [key: string]: ICourse[]
}

function AddLessonPage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  // states
  const [lesson, setLesson] = useState<ILesson | null>(null)
  const [groupTypes, setGroupTypes] = useState<GroupTypes>({})
  const [isEditingUsingUser, setIsEditingUsingUser] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      type: '',
      info: '',
      renew: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      active: true,
      notify: true,
      usingUser: '',
      message: '',
    },
  })

  // MARK: Get Data
  // get lesson to edit
  useEffect(() => {
    const getLesson = async () => {
      // star page loading
      dispatch(setPageLoading(true))

      try {
        const { lesson } = await getLessonApi(id) // no-cache

        // set lesson to state
        setLesson(lesson)

        // set value to form
        setValue('type', lesson.type)
        setValue('info', lesson.info)
        setValue('renew', new Date(lesson.renew).toISOString().split('T')[0])
        setValue('days', lesson.times.days)
        setValue('hours', lesson.times.hours)
        setValue('minutes', lesson.times.minutes)
        setValue('seconds', lesson.times.seconds)
        setValue('active', lesson.active)
        setValue('usingUser', lesson.usingUser)
        setValue('notify', !!lesson.usingUser)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getLesson()
  }, [dispatch, id, setValue])

  // get all types (courses)
  useEffect(() => {
    const getAllTypes = async () => {
      try {
        // send request to server to get all courses
        const { courses } = await getForceAllCoursesApi()

        // // group course be category.title
        // const groupTypes: GroupTypes = {}
        // courses.forEach((course: ICourse) => {
        //   if (!groupTypes[course.category.title]) {
        //     groupTypes[course.category.title] = []
        //   }
        //   groupTypes[course.category.title].push(course)
        // })

        setGroupTypes(groupTypes)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getAllTypes()
  }, [groupTypes])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // day must be >= 0
      if (data.days < 0) {
        setError('days', { type: 'manual', message: 'Days must be >= 0' })
        isValid = false
      }

      // hours must be >= 0 and <= 23
      if (data.hours < 0 || data.hours > 23) {
        setError('hours', { type: 'manual', message: 'Hours must be from 0 - 23' })
        isValid = false
      }

      // minutes must be >= 0 and <= 59
      if (data.minutes < 0 || data.minutes > 59) {
        setError('minutes', { type: 'manual', message: 'Minutes must be from 0 - 59' })
        isValid = false
      }

      // seconds must be >= 0 and <= 59
      if (data.seconds < 0 || data.seconds > 59) {
        setError('seconds', { type: 'manual', message: 'Seconds must be from 0 - 59' })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Submit
  // send request to server to edit lesson
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (!handleValidate(data)) return

    // start loading
    dispatch(setLoading(true))

    try {
      const { message } = await updateLessonApi(id, data)

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
      // stop loading
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='max-w-1200 mx-auto'>
      {/* MARK: Admin Header */}
      <AdminHeader title='Edit Lesson' backLink='/admin/lesson/all' />

      <div className='mt-5'>
        {/* Type */}
        <div className='mb-5'>
          <div className={`flex`}>
            <span
              className={`inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 ${
                errors.type ? 'border-rose-400 bg-rose-100' : 'border-slate-200 bg-slate-100'
              }`}>
              <MdCategory size={19} className='text-secondary' />
            </span>
            <div
              className={`relative w-full border-[2px] border-l-0 bg-white rounded-tr-lg rounded-br-lg ${
                errors.type ? 'border-rose-400' : 'border-slate-200'
              }`}>
              <select
                id='type'
                className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
                disabled={isLoading}
                {...register('type', { required: true })}>
                <option value=''>Select Type</option>
                {Object.keys(groupTypes)?.map(key => (
                  <optgroup label={key} key={key}>
                    {groupTypes[key].map(course => (
                      <option
                        value={course._id}
                        selected={course._id === lesson?.courseId}
                        key={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {/* label */}
              <label
                htmlFor='type'
                className={`absolute rounded-md text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer ${
                  errors.type ? 'text-rose-400' : 'text-dark'
                }`}>
                Tye
              </label>
            </div>
          </div>
          {errors.type?.message && (
            <span className='text-sm text-rose-400'>{errors.type?.message?.toString()}</span>
          )}
        </div>

        {/* Info */}
        <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='textarea'
          rows={8}
          icon={FaInfo}
          className='mb-5'
          onFocus={() => clearErrors('info')}
        />

        {/* Active */}
        <div className='flex mb-5'>
          <div className='bg-white rounded-lg px-3 flex items-center'>
            <FaCheck size={16} className='text-secondary' />
          </div>
          <input
            className='peer'
            type='checkbox'
            id='active'
            hidden
            {...register('active', { required: false })}
          />
          <label
            className={`select-none cursor-pointer border border-green-500 px-4 py-2 rounded-lg common-transition bg-white text-green-500 peer-checked:bg-green-500 peer-checked:text-white`}
            htmlFor='active'>
            Active
          </label>
        </div>

        {/* Save Button */}
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

export default AddLessonPage
