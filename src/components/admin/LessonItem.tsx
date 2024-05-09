import { ICourse } from '@/models/CourseModel'
import { ILesson } from '@/models/LessonModel'
import { formatTime } from '@/utils/time'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'

interface LessonItemProps {
  data: ILesson
  loadingLessons: string[]
  className?: string

  selectedLessons: string[]
  setSelectedLessons: React.Dispatch<React.SetStateAction<string[]>>

  handleActivateLessons: (ids: string[], value: boolean) => void
  handleDeleteLessons: (ids: string[]) => void
}

function LessonItem({
  data,
  loadingLessons,
  className = '',
  // selected
  selectedLessons,
  setSelectedLessons,
  // functions
  handleActivateLessons,
  handleDeleteLessons,
}: LessonItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // handle copy
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép: ' + text)
  }, [])

  return (
    <>
      <div
        className={`relative w-full flex items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer common-transition ${
          selectedLessons.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedLessons(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        <div className='w-[calc(100%_-_42px)]'>
          {/* MARK: Thumbnails */}
          <Link
            href={`/${(data.courseId as ICourse).slug || ''}`}
            prefetch={false}
            onClick={e => e.stopPropagation()}
            className='mr-4 flex items-center max-w-[160px] rounded-lg shadow-md overflow-hidden mb-2'>
            <div className='flex items-center w-full overflow-x-scroll snap-x snap-mandatory no-scrollbar'>
              <Image
                className='aspect-video flex-shrink-0 snap-start object-cover w-full h-full'
                src={(data.courseId as ICourse).images[0] || '/images/not-found.jpg'}
                height={200}
                width={200}
                alt='thumbnail'
              />
            </div>
          </Link>

          {/* Type */}
          <p
            className='inline-flex mb-2 flex-wrap gap-2 items-center font-semibold text-[18px] mr-2 leading-5 font-body tracking-wide'
            title={(data.courseId as ICourse).title}>
            {(data.courseId as ICourse).categories.map((category: any) => (
              <span
                className={`shadow-md text-xs ${
                  category.title ? 'bg-yellow-300 text-dark' : 'bg-slate-200 text-slate-400'
                } px-2 py-px select-none rounded-md font-body`}
                key={category._id}>
                {category.title || 'empty'}
              </span>
            ))}
            {(data.courseId as ICourse).title}
          </p>

          {/* Updated  */}
          <p className='text-sm' title='Expire (d/m/y)'>
            <span className='font-semibold'>Updated: </span>
            <span
              className={`${
                +new Date() - +new Date(data.updatedAt) <= 60 * 60 * 1000 ? 'text-yellow-500' : ''
              }`}>
              {formatTime(data.updatedAt)}
            </span>
          </p>

          {/* Info */}
          <div className='relative'>
            <div className='w-full mt-2 max-h-[200px] border rounded-lg p-2 text-sm font-body tracking-wide overflow-scroll whitespace-pre break-all'>
              {data.description}
            </div>
          </div>
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-col flex-shrink-0 border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
          {/* Active Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              handleActivateLessons([data._id], !data.active)
            }}
            title={data.active ? 'Deactivate' : 'Activate'}>
            <FaCheck
              size={18}
              className={`wiggle ${data.active ? 'text-green-500' : 'text-slate-300'}`}
            />
          </button>

          {/* Edit Button Link */}
          <Link
            href={`/admin/account/${data._id}/edit`}
            className='block group'
            title='Edit'
            onClick={e => e.stopPropagation()}>
            <MdEdit size={18} className='wiggle' />
          </Link>

          {/* Delete Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingLessons.includes(data._id)}
            title='Delete'>
            {loadingLessons.includes(data._id) ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaTrash size={18} className='wiggle' />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Lesson'
        content='Are you sure that you want to delete this account?'
        onAccept={() => handleDeleteLessons([data._id])}
        isLoading={loadingLessons.includes(data._id)}
      />
    </>
  )
}

export default LessonItem
