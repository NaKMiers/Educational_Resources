'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FaCheck, FaFile, FaInfo } from 'react-icons/fa'

import AdminHeader from '@/components/admin/AdminHeader'
import { setLoading } from '@/libs/reducers/modalReducer'
import { IChapter } from '@/models/ChapterModel'
import { ICourse } from '@/models/CourseModel'
import { addLessonApi, getForceAllCoursesApi } from '@/requests'
import { getForceAllChaptersApi } from '@/requests/chapterRequest'
import toast from 'react-hot-toast'
import { FaX } from 'react-icons/fa6'
import { MdCategory } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'
import { SiFramer } from 'react-icons/si'

export type GroupCourses = {
  [key: string]: ICourse[]
}

function AddLessonPage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)

  // states
  const [groupCourses, setGroupTypes] = useState<GroupCourses>({})
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [chapters, setChapters] = useState<IChapter[]>([])
  const [sourceType, setSourceType] = useState<'file' | 'embed'>('embed')
  const [fileUrl, setFileUrl] = useState<string>('')
  const [embedSrc, setEmbedSrc] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      courseId: '',
      chapterId: '',
      title: '',
      description: '',
      hours: 0,
      minutes: 1,
      seconds: 0,
      active: true,
    },
  })

  // MARK: Get Data
  // get all types (courses)
  useEffect(() => {
    const getAllTypes = async () => {
      try {
        // send request to server to get all courses
        const { courses } = await getForceAllCoursesApi()

        // group course by category.title when course.categories is an array
        const groupCourses: GroupCourses = {}

        courses.forEach((course: ICourse) => {
          course.categories.forEach((category: any) => {
            const categoryTitle = category.title

            if (!groupCourses[categoryTitle]) {
              groupCourses[categoryTitle] = []
            }

            groupCourses[categoryTitle].push(course)
          })
        })

        setGroupTypes(groupCourses)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getAllTypes()
  }, [])

  // get chapters of selected course
  useEffect(() => {
    const getChapters = async () => {
      if (!selectedCourse) return

      try {
        // send request to server to get all chapters of selected course
        const { chapters } = await getForceAllChaptersApi(selectedCourse)
        setChapters(chapters)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getChapters()
  }, [selectedCourse])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // chapterId is required
      if (!data.chapterId) {
        toast.error('Please select a chapter')
        isValid
      }

      // hours must be >= 0 and <= 23
      if (data.hours < 0) {
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
  // send request to server to add lesson
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (!handleValidate(data)) return

    if (!file && !fileUrl && !embedSrc) {
      return toast.error('Please embed an url or upload a video')
    }

    dispatch(setLoading(true))

    try {
      const formData = new FormData()
      formData.append('courseId', data.courseId)
      formData.append('chapterId', data.chapterId)
      formData.append('title', data.title)
      formData.append('description', data.title)
      formData.append('duration', data.hours * 3600 + data.minutes * 60 + data.seconds)
      formData.append('active', data.active)
      if (sourceType === 'file' && file) {
        formData.append('file', file)
      } else if (sourceType === 'embed' && embedSrc) {
        formData.append('embedUrl', embedSrc)
      }

      // add new category here
      const { message } = await addLessonApi(formData)

      // show success message
      toast.success(message)

      // clear form
      reset()
      setFile(null)
      setFileUrl('')
      setEmbedSrc('')
      URL.revokeObjectURL(fileUrl)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      dispatch(setLoading(false))
    }
  }

  // handle add files when user select files
  const handleAddFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0]

        // validate file type and size
        if (!file.type.startsWith('video/')) {
          return toast.error('Please select a video')
        }
        if (file.size > 25 * 1024 * 1024) {
          return toast.error('Please select an video less than 25Mb or select an url fileUrl instead')
        }

        setFile(file)

        if (fileUrl) {
          URL.revokeObjectURL(fileUrl)
        }
        setFileUrl(URL.createObjectURL(file))

        e.target.value = ''
        e.target.files = null
      }
    },
    [fileUrl]
  )

  // handle remove image
  const handleRemoveSource = useCallback(
    (url: string) => {
      if (sourceType === 'file') {
        setFile(null)
        setFileUrl('')
      } else if (sourceType === 'embed') {
        setEmbedSrc('')
      }
      URL.revokeObjectURL(url)
    },
    [setFile, setFileUrl, sourceType]
  )

  const handlePaste = (e: any) => {
    const pasteData = e.clipboardData.getData('text/plain')

    if (pasteData.includes('<iframe')) {
      const src = pasteData.match(/src="([^"]+)"/)

      if (src) {
        setTimeout(() => {
          setEmbedSrc(src[1])
        }, 0)
      }
    }
  }

  // revoke blob url when component unmount
  useEffect(() => {
    return () => URL.revokeObjectURL(fileUrl)
  }, [fileUrl])

  return (
    <div className='max-w-1200 mx-auto'>
      {/* MARK: Admin Header */}
      <AdminHeader title='Add Lesson' backLink='/admin/lesson/all' />

      <div className='mt-5 bg-slate-200 p-21 rounded-lg shadow-lg'>
        {/* CourseId */}
        <div className='mb-5'>
          <div className={`flex`}>
            <span
              className={`inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 ${
                errors.courseId ? 'border-rose-400 bg-rose-100' : 'border-slate-200 bg-slate-100'
              }`}>
              <MdCategory size={19} className='text-secondary' />
            </span>
            <div
              className={`relative w-full border-[2px] border-l-0 bg-white rounded-tr-lg rounded-br-lg ${
                errors.courseId ? 'border-rose-400' : 'border-slate-200'
              }`}>
              <select
                id='courseId'
                className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
                disabled={isLoading}
                {...register('courseId', { required: true })}
                onChange={e => setSelectedCourse(e.target.value)}>
                <option value=''>Select Course</option>
                {Object.keys(groupCourses)?.map(key => (
                  <optgroup label={key} key={key}>
                    {groupCourses[key].map(course => (
                      <option value={course._id} key={course._id}>
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
                  errors.couseId ? 'text-rose-400' : 'text-dark'
                }`}>
                CouseId
              </label>
            </div>
          </div>
          {errors.type?.message && (
            <span className='text-sm text-rose-400'>{errors.type?.message?.toString()}</span>
          )}
        </div>

        {/* ChapterId */}
        <div className='mb-5'>
          <div className={`flex`}>
            <span
              className={`inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 ${
                errors.chapterId ? 'border-rose-400 bg-rose-100' : 'border-slate-200 bg-slate-100'
              }`}>
              <MdCategory size={19} className='text-secondary' />
            </span>
            <div
              className={`relative w-full border-[2px] border-l-0 bg-white rounded-tr-lg rounded-br-lg ${
                errors.chapterId ? 'border-rose-400' : 'border-slate-200'
              }`}>
              <select
                id='chapterId'
                className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
                disabled={isLoading}
                required
                {...register('chapterId', { required: true })}>
                <option value=''>Select Chapter</option>
                {chapters.map(chapter => (
                  <option value={chapter._id} key={chapter._id}>
                    {chapter.title}
                  </option>
                ))}
              </select>

              {/* label */}
              <label
                htmlFor='type'
                className={`absolute rounded-md text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer ${
                  errors.chapterId ? 'text-rose-400' : 'text-dark'
                }`}>
                ChapterId
              </label>
            </div>
          </div>
          {errors.type?.message && (
            <span className='text-sm text-rose-400'>{errors.type?.message?.toString()}</span>
          )}
        </div>

        {/* Title */}
        <Input
          id='title'
          label='Title'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={RiCharacterRecognitionLine}
          className='mb-5'
          onFocus={() => clearErrors('title')}
        />

        {/* Description */}
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
          onFocus={() => clearErrors('description')}
          className='mb-5'
        />

        {/* MARK: Duration */}
        <p className='text-dark font-semibold text-xl mb-1'>Duration</p>
        <div className='grid grid-cols-1 md:grid-cols-3 mb-5 gap-2'>
          {/* Hours */}
          <Input
            id='hours'
            label='Hours'
            disabled={isLoading}
            register={register}
            errors={errors}
            type='number'
            min={0}
            onFocus={() => clearErrors('hours')}
          />
          {/* Minutes */}
          <Input
            id='minutes'
            label='Minutes'
            disabled={isLoading}
            register={register}
            errors={errors}
            type='number'
            min={0}
            max={59}
            onFocus={() => clearErrors('minutes')}
          />
          {/* Seconds */}
          <Input
            id='seconds'
            label='Seconds'
            disabled={isLoading}
            register={register}
            errors={errors}
            type='number'
            min={0}
            max={59}
            onFocus={() => clearErrors('seconds')}
          />
        </div>

        <div className='mb-5'>
          <div className={`flex`}>
            <span
              className={`inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 border-slate-200 bg-slate-100`}>
              <MdCategory size={19} className='text-secondary' />
            </span>
            <div
              className={`relative w-full border-[2px] border-l-0 bg-white rounded-tr-lg rounded-br-lg border-slate-200`}>
              <select
                id='sourceType'
                className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
                disabled={isLoading}
                value={sourceType}
                onChange={(e: any) => setSourceType(e.target.value)}>
                <option value='embed'>Embed</option>
                <option value='file'>File</option>
              </select>

              {/* label */}
              <label
                htmlFor='sourceType'
                className={`absolute rounded-md text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer ${
                  errors.couseId ? 'text-rose-400' : 'text-dark'
                }`}>
                Source Type
              </label>
            </div>
          </div>
          {errors.type?.message && (
            <span className='text-sm text-rose-400'>{errors.type?.message?.toString()}</span>
          )}
        </div>

        {/* Source */}
        <div className='mb-5'>
          {sourceType === 'file' ? (
            <div className='flex'>
              <span className='inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 border-slate-200 bg-slate-100'>
                <FaFile size={19} className='text-secondary' />
              </span>
              <div className='relative w-full border-[2px] border-l-0 rounded-r-lg bg-white border-slate-200'>
                <input
                  id='fileUrl'
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
                  placeholder=' '
                  disabled={isLoading}
                  type='file'
                  onChange={handleAddFile}
                />

                {/* label */}
                <label
                  htmlFor={'fileUrl'}
                  className='absolute rounded-md text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer text-dark'>
                  Source
                </label>
              </div>
            </div>
          ) : (
            <div className='flex'>
              <span className='inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 border-slate-200 bg-slate-100'>
                <SiFramer size={19} className='text-secondary' />
              </span>
              <div className='relative w-full border-[2px] border-l-0 rounded-r-lg bg-white border-slate-200'>
                <input
                  id='fileUrl'
                  className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
                  placeholder=' '
                  disabled={isLoading}
                  type='url'
                  value={embedSrc}
                  onPaste={handlePaste}
                  onChange={e => setEmbedSrc(e.target.value)}
                />

                {/* label */}
                <label
                  htmlFor={'fileUrl'}
                  className='absolute rounded-md text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer text-dark'>
                  Source
                </label>
              </div>
            </div>
          )}
        </div>

        {((fileUrl && sourceType === 'file') || (embedSrc && sourceType === 'embed')) && (
          <div className='relative aspect-video rounded-lg bg-white p-21 mb-5'>
            {fileUrl && sourceType === 'file' && (
              <video className='rounded-lg w-full h-full object-contain' src={fileUrl} controls />
            )}
            {embedSrc && sourceType === 'embed' && (
              <iframe
                className='rounded-lg w-full h-full object-contain'
                width='1519'
                height='574'
                src={embedSrc}
                title='Is Civilization on the Brink of Collapse?'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              />
            )}

            <button
              onClick={() => handleRemoveSource(fileUrl)}
              className='absolute top-2 bg-slate-300 p-2 right-2 group hover:bg-dark-100 rounded-lg'>
              <FaX size={16} className='text-dark group-hover:text-white common-transition' />
            </button>
          </div>
        )}

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

        {/* MARK: Add Button */}
        <LoadingButton
          className='px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'
          onClick={handleSubmit(onSubmit)}
          text='Add'
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddLessonPage
