import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { formatPrice } from '@/utils/number'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaCheck, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa'
import { IoBalloonSharp } from 'react-icons/io5'
import { MdEdit } from 'react-icons/md'
import { PiLightningFill, PiLightningSlashFill } from 'react-icons/pi'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface CourseItemProps {
  data: ICourse
  loadingCourses: string[]
  className?: string

  // selected
  selectedCourses: string[]
  setSelectedCourses: React.Dispatch<React.SetStateAction<string[]>>

  // functions
  handleActivateCourses: (ids: string[], active: boolean) => void
  hanldeRemoveApplyingFlashsales: (ids: string[]) => void
  handleDeleteCourses: (ids: string[]) => void
}

function CourseItem({
  data,
  loadingCourses,
  className = '',
  // selected
  selectedCourses,
  setSelectedCourses,
  // functions
  handleActivateCourses,
  hanldeRemoveApplyingFlashsales,
  handleDeleteCourses,
}: CourseItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<'deactivate' | 'Remove Flash Sale' | 'delete'>('delete')

  return (
    <>
      <div
        className={`relative flex justify-between items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer trans-200 ${
          selectedCourses.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedCourses(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
      >
        <div className='flex-grow'>
          {/* MARK: Thumbnails */}
          <Link
            href={`/${data.slug}`}
            prefetch={false}
            className='relative flex items-center max-w-[160px] rounded-lg shadow-md overflow-hidden mb-2'
            onClick={e => e.stopPropagation()}
          >
            <div className='flex items-center w-full overflow-x-scroll snap-x snap-mandatory no-scrollbar'>
              {data.images.map((src, index) => (
                <Image
                  key={index}
                  className='aspect-video flex-shrink-0 snap-start'
                  src={src}
                  height={200}
                  width={200}
                  alt='thumbnail'
                />
              ))}
            </div>
          </Link>

          {/* Flash sale */}
          {data.flashSale && (
            <PiLightningFill
              className='absolute -top-1.5 left-1 text-yellow-400 animate-bounce'
              size={25}
            />
          )}

          {/* Categories */}
          <p
            className='flex flex-wrap gap-1 font-semibold text-dark text-[18px] leading-4 font-body tracking-wide'
            title={data.title}
          >
            {(data.categories as ICategory[]).map(category => (
              <Link
                href={`/courses?ctg=${category.slug}`}
                className={`shadow-md text-xs ${
                  category.title ? 'bg-yellow-300 text-dark' : 'bg-slate-200 text-slate-400'
                } px-2 py-px select-none rounded-md font-body`}
                key={category._id}
              >
                {category.title || 'empty'}
              </Link>
            ))}
          </p>

          {/* Title */}
          <p className='text-dark font-semibold tracking-wider mt-1'>{data.title}</p>

          {/* Author */}
          <p className='text-slate-500 font-semibold tracking-wider mb-1'>
            Author: <span className='font-normal'>{data.author}</span>
          </p>

          {/* Price - Old Price */}
          <div className='flex items-center flex-wrap gap-2'>
            <p className='font-semibold text-xl text-primary'>{formatPrice(data.price)}</p>
            {data.oldPrice && (
              <p className='line-through text-slate-500 text-sm'>{formatPrice(data.oldPrice)}</p>
            )}
          </div>

          {/* Tags */}
          <p className='text-slate-500'>
            <span className='text-dark font-semibold'>Tags: </span>
            {data.tags.map((tag: any, index) => (
              <span key={tag.slug} className='text-slate-400'>
                {tag.title}
                {index < data.tags.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          {/* Joined */}
          <p className='text-slate-500'>
            <span className='text-dark font-semibold'>Joined: </span>
            {data.joined} students
          </p>
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-col border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
          {/* Active Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              // is being active
              if (data.active) {
                setIsOpenConfirmModal(true)
                setConfirmType('deactivate')
              } else {
                handleActivateCourses([data._id], true)
              }
            }}
            disabled={loadingCourses.includes(data._id)}
            title={data.active ? 'Deactivate' : 'Activate'}
          >
            <FaCheck
              size={18}
              className={`wiggle ${data.active ? 'text-green-500' : 'text-slate-300'}`}
            />
          </button>

          {/* Remove Flashsale Button */}
          {data.flashSale && (
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
                setIsOpenConfirmModal(true)
                setConfirmType('Remove Flash Sale')
              }}
              disabled={loadingCourses.includes(data._id)}
              title='Remove Flash Sale'
            >
              <PiLightningSlashFill size={18} className='wiggle text-yellow-400' />
            </button>
          )}

          {/* Edit Button Link */}
          <Link
            href={`/admin/course/${data._id}/edit`}
            className='block group'
            onClick={e => e.stopPropagation()}
            title='Edit'
          >
            <MdEdit size={18} className='wiggle' />
          </Link>

          {/* All Chapters Button Link */}
          <Link
            href={`/admin/chapter/${data._id}/all`}
            className='block group'
            onClick={e => e.stopPropagation()}
            title='View Chapters'
          >
            <FaEye size={18} className='wiggle' />
          </Link>

          {/* Delete Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingCourses.includes(data._id)}
            title='Delete'
          >
            {loadingCourses.includes(data._id) ? (
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
        title={`${confirmType.charAt(0).toUpperCase() + confirmType.slice(1)} Course`}
        content={`Are you sure that you want to ${confirmType} this course?`}
        onAccept={() =>
          confirmType === 'deactivate'
            ? handleActivateCourses([data._id], false)
            : confirmType === 'Remove Flash Sale'
            ? hanldeRemoveApplyingFlashsales([data._id])
            : handleDeleteCourses([data._id])
        }
        isLoading={loadingCourses.includes(data._id)}
      />
    </>
  )
}

export default CourseItem
