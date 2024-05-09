import { ICourse } from '@/models/CourseModel'
import { ILesson } from '@/models/LessonModel'
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
        className={`relative text-dark w-full flex items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer common-transition ${
          selectedLessons.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedLessons(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        <div className='w-[calc(100%_-_42px)]'>
          {/* MARK: Thumbnails */}
          <div className='flex flex-wrap gap-2'>
            <Link
              href={`/${(data.courseId as ICourse).slug || ''}`}
              prefetch={false}
              onClick={e => e.stopPropagation()}
              className='flex items-center max-w-[120px] sm:max-w-[200px] rounded-lg shadow-md overflow-hidden mb-2'>
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
            <div className='flex items-center max-w-[120px] sm:max-w-[200px] rounded-lg shadow-md overflow-hidden mb-2'>
              {data.sourceType === 'file' ? (
                <video
                  className='aspect-video flex-shrink-0 snap-start object-cover w-full h-full'
                  src={data.source}
                  height={200}
                  width={200}
                  controls
                />
              ) : (
                <iframe
                  className='aspect-video rounded-lg w-full h-full object-contain'
                  width='1519'
                  height='574'
                  src={data.source}
                  title='Is Civilization on the Brink of Collapse?'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  referrerPolicy='strict-origin-when-cross-origin'
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* Course */}
          <p
            className='inline-flex mb-2 flex-wrap gap-2 items-center font-semibold text-[18px] mr-2 font-body tracking-wide'
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
          </p>

          {/* Title */}
          <p className='mb-1 font-semibold text-[18px] font-body tracking-wide'>
            {data.title} <span className='text-slate-500 text-sm font-normal'>({data.sourceType})</span>
          </p>
          <p className='mb-2 font-semibold text-sm text-sky-500 font-body tracking-wide'>
            {Math.floor(data.duration / 3600)}h:{Math.floor((data.duration % 3600) / 60)}m:
            {Math.floor((data.duration % (3600 * 60)) / 60)}s
          </p>
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
            href={`/admin/lesson/${data._id}/edit`}
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
        content='Are you sure that you want to delete this lesson?'
        onAccept={() => handleDeleteLessons([data._id])}
        isLoading={loadingLessons.includes(data._id)}
      />
    </>
  )
}

export default LessonItem
