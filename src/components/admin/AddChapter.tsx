'use client'

import { EditingValues } from '@/app/(admin)/admin/chapter/[courseId]/all/page'
import { IChapter } from '@/models/ChapterModel'
import { addNewChapterApi, updateChapterApi } from '@/requests/chapterRequest'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AiOutlineNumber } from 'react-icons/ai'
import { MdOutlineFormatColorText } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import Input from '../Input'

interface AddChapterProps {
  courseId: string
  className?: string
  chapters: IChapter[]
  setChapters: Dispatch<SetStateAction<IChapter[]>>
  editingValues: EditingValues | null
  setEditingValues: Dispatch<SetStateAction<EditingValues | null>>
}

function AddChapter({
  courseId,
  chapters,
  setChapters,
  editingValues,
  setEditingValues,
  className,
}: AddChapterProps) {
  // hooks

  // states
  const [loading, setLoading] = useState<boolean>(false)

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      title: '',
      content: '',
      order: 0,
    }),
    []
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues,
  })

  // auto set order value
  useEffect(() => {
    setValue('order', chapters.reduce((max, chapter) => Math.max(max, chapter.order), 0) + 1)
  }, [chapters, setValue])

  // auto set editing values
  useEffect(() => {
    if (editingValues) {
      setValue('title', editingValues.title)
      setValue('content', editingValues.content)
      setValue('order', editingValues.order)
    }
  }, [editingValues, setValue])

  // handle add new chapter to course
  const handleAddChapter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // start loading
      setLoading(true)

      try {
        const { newChapter, message } = await addNewChapterApi(courseId, data)

        // update states
        setChapters(prev => [...prev, newChapter])

        // reset form
        reset()

        // notify success
        toast.success(message)
      } catch (err: any) {
        console.error(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    },
    [reset, setChapters, courseId]
  )

  // handle update chapter
  const handleUpdateChapter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (!editingValues?._id) return

      // start loading
      setLoading(true)

      try {
        const { updatedChapter, message } = await updateChapterApi(editingValues._id, data)

        // update states
        setChapters(prev =>
          prev.map(chapter => (chapter._id === updatedChapter._id ? updatedChapter : chapter))
        )

        // reset form
        reset()

        // notify success
        toast.success(message)
      } catch (err: any) {
        console.error(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    },
    [reset, setChapters, editingValues]
  )

  return (
    <div className={`bg-white px-3 py-2 rounded-lg flex items-start gap-2 ${className}`}>
      {/* Title */}
      <Input
        id='title'
        className='w-full'
        label='Title'
        disabled={false}
        register={register}
        errors={errors}
        type='text'
        required
        icon={MdOutlineFormatColorText}
        onFocus={() => clearErrors('title')}
      />

      {/* Content */}
      <Input
        id='content'
        className='w-full'
        label='Content'
        disabled={false}
        register={register}
        errors={errors}
        type='textarea'
        rows={1}
        icon={MdOutlineFormatColorText}
        onFocus={() => clearErrors('content')}
      />

      {/* Order */}
      <Input
        id='order'
        className='w-full'
        label='Order'
        disabled={false}
        register={register}
        errors={errors}
        type='number'
        min={0}
        required
        icon={AiOutlineNumber}
        onFocus={() => clearErrors('order')}
      />

      {/* Reset Button */}
      <div className='flex gap-2'>
        {editingValues?._id && (
          <button
            className='h-[40px] group flex items-center text-nowrap bg-slate-400 text-[16px] font-semibold px-3 rounded-md cursor-pointer hover:bg-slate-800 text-white trans-200'
            title='Alt + R'
            onClick={() =>
              setEditingValues({
                _id: '',
                title: '',
                content: '',
                order: chapters.reduce((max, chapter) => Math.max(max, chapter.order), 0) + 1,
              })
            }>
            Cancel
          </button>
        )}
        <button
          className='h-[40px] group flex items-center text-nowrap bg-yellow-400 text-[16px] font-semibold px-3 rounded-md cursor-pointer hover:bg-slate-800 text-white trans-200'
          title='Alt + R'
          onClick={
            !editingValues?._id ? handleSubmit(handleAddChapter) : handleSubmit(handleUpdateChapter)
          }>
          {loading ? (
            <RiDonutChartFill size={24} className='animate-spin text-slate-400' />
          ) : editingValues?._id ? (
            'Save'
          ) : (
            'Add'
          )}
        </button>
      </div>
    </div>
  )
}

export default AddChapter
