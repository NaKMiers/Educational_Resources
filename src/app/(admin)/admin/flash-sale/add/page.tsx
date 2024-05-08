'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { addFlashSaleApi, getAllCoursesApi, getForceAllCoursesApi } from '@/requests'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaPause, FaPlay } from 'react-icons/fa6'
import { IoReload } from 'react-icons/io5'

import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddFlashSalePage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)

  // states
  const [courses, setCourses] = useState<ICourse[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [timeType, setTimeType] = useState<'loop' | 'once'>('loop')

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
      type: 'percentage',
      value: '',
      begin: new Date().toISOString().split('T')[0],
      expire: '',
      timeType: 'loop',
      duration: 120,
    },
  })

  // MARK: Get Data
  // get all courses to apply
  useEffect(() => {
    const getAllCourses = async () => {
      try {
        // send request to server
        const { courses } = await getForceAllCoursesApi()

        // // categorize courses
        // const categorizedCoursesObj = courses.reduce((acc: any, course: ICourse) => {
        //   if (!acc[course.category.title]) {
        //     acc[course.category.title] = []
        //   }
        //   acc[course.category.title].push(course)
        //   return acc
        // }, {})

        // const categorizedCourses = Object.values(categorizedCoursesObj).flat() as ICourse[]

        // set courses to state
        // setCourses(categorizedCourses)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getAllCourses()
  }, [])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // if type if percentage, value must have % at the end
      if (data.type === 'percentage' && !data.value.endsWith('%')) {
        setError('value', { type: 'manual', message: 'Value must have %' })
        isValid = false
      }

      // if type if percentage, value have '%' at the end and must be number
      if (data.type === 'percentage' && isNaN(Number(data.value.replace('%', '')))) {
        setError('value', { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      // if type if fixed-reduce, value must be number
      if (data.type !== 'percentage' && isNaN(Number(data.value))) {
        setError('value', { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      // if time type is loop, duration must be > 0
      if (data.timeType === 'loop' && data.duration <= 0) {
        setError('duration', { type: 'manual', message: 'Duration must be > 0' })
        isValid = false
      }

      // if expire is less than begin
      if (new Date(data.expire).getTime() <= new Date(data.begin).getTime()) {
        setError('expire', { type: 'manual', message: 'Expire must be > begin' })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Submit
  // handle send request to server to add flash sale
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (!handleValidate(data)) return

    // set loading
    dispatch(setLoading(true))

    try {
      // send request to server
      const { message } = await addFlashSaleApi({
        ...data,
        appliedCourses: selectedCourses,
      })

      // show success message
      toast.success(message)

      // reset
      reset()
      setSelectedCourses([])

      // update courses
      const { courses } = await getAllCoursesApi()
      setCourses(courses)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='max-w-1200 mx-auto'>
      {/* MARK: Admin Header */}
      <AdminHeader title='Add Flash Sale' backLink='/admin/flash-sale/all' />

      <div className='mt-5 bg-slate-200 rounded-lg p-21'>
        {/* Type */}
        <Input
          id='type'
          label='Type'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='select'
          onFocus={() => clearErrors('type')}
          options={[
            {
              label: 'Percentage',
              value: 'percentage',
              selected: true,
            },
            {
              label: 'Fixed-Reduce',
              value: 'fixed-reduce',
              selected: false,
            },
            {
              label: 'Fixed',
              value: 'fixed',
              selected: false,
            },
          ]}
          icon={RiCharacterRecognitionLine}
          className='mb-5'
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
          className='mb-5'
          onFocus={() => clearErrors('value')}
        />

        {/* Begin */}
        <Input
          id='begin'
          label='Begin'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='date'
          minDate={new Date().toISOString().split('T')[0]}
          icon={FaPlay}
          className='mb-5'
          onFocus={() => clearErrors('begin')}
        />

        {/* MARK: Time */}
        <div className='grid grid-col-1 lg:grid-cols-2 gap-5 mb-5'>
          {/* Time Type */}
          <Input
            id='timeType'
            label='Time Type'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='select'
            onFocus={() => clearErrors('timeType')}
            onChange={e => {
              setValue('timeType', e.target.value)
              setTimeType(e.target.value as 'loop' | 'once')
            }}
            options={[
              {
                label: 'Loop',
                value: 'loop',
                selected: true,
              },
              {
                label: 'Once',
                value: 'once',
                selected: false,
              },
            ]}
            icon={RiCharacterRecognitionLine}
          />

          {timeType === 'loop' ? (
            // Duration
            <Input
              id='duration'
              label='Duration'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='number'
              icon={IoReload}
              onFocus={() => clearErrors('duration')}
            />
          ) : (
            // Expire
            <Input
              id='expire'
              label='Expire'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='date'
              icon={FaPause}
              onFocus={() => clearErrors('expire')}
            />
          )}
        </div>

        {/* MARK: Apply */}
        {/* Ready to apply courses */}
        <p className='text-white font-semibold text-xl mb-1'>Select Courses</p>
        <div className='max-h-[300px] overflow-y-auto flex flex-wrap rounded-lg bg-white p-3 gap-2 mb-5'>
          {courses.map(course => (
            <div
              className={`max-w-[250px] border-2 border-slate-300 rounded-lg flex items-center py-1 px-2 gap-2 cursor-pointer common-transition ${
                selectedCourses.includes(course._id)
                  ? 'bg-secondary border-white text-white'
                  : course.flashSale
                  ? 'bg-slate-200'
                  : ''
              }`}
              title={course.title}
              onClick={() =>
                selectedCourses.includes(course._id)
                  ? setSelectedCourses(prev => prev.filter(id => id !== course._id))
                  : setSelectedCourses(prev => [...prev, course._id])
              }
              key={course._id}>
              <Image
                className='aspect-video rounded-md border-2 border-white'
                src={course.images[0]}
                height={60}
                width={60}
                alt='thumbnail'
              />
              <span className='block text-sm text-ellipsis line-clamp-1 text-nowrap'>
                {course.title}
              </span>
            </div>
          ))}
        </div>

        {/* MARK: Add Button */}
        <LoadingButton
          className='px-4 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-semibold common-transition'
          onClick={handleSubmit(onSubmit)}
          text='Add'
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddFlashSalePage
