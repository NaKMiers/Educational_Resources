import { formatPrice } from '@/utils/number'
import { formatTime } from '@/utils/time'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'
import { IFlashSale } from '@/models/FlashSaleModel'

interface FlashSaleItemProps {
  data: IFlashSale
  loadingFlashSales: string[]
  className?: string

  selectedFlashSales: string[]
  setSelectedFlashSales: React.Dispatch<React.SetStateAction<string[]>>

  handleDeleteFlashSales: (ids: string[]) => void
}

function FlashSaleItem({
  data,
  loadingFlashSales,
  className = '',
  // selected
  selectedFlashSales,
  setSelectedFlashSales,
  // functions
  handleDeleteFlashSales,
}: FlashSaleItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`flex flex-col p-4 rounded-lg shadow-lg cursor-pointer common-transition text-dark ${
          selectedFlashSales.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedFlashSales(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        {/* MARK: Body */}
        {/* Value - Time Type */}
        <div className='font-semibold' title='netflix'>
          <span title='Value' className='font-semibold text-primary mr-2'>
            {data.type === 'percentage' ? data.value : formatPrice(+data.value)}
          </span>

          <span title='Time Type'>{data.timeType}</span>
        </div>

        {/* Type - Duration */}
        <div className='font-semibold' title='netflix'>
          <span className='mr-2' title='Type'>
            {data.type}
          </span>
          {data.timeType === 'loop' && (
            <span className='font-semobold text-secondary' title='duration'>
              {data.duration}
            </span>
          )}
        </div>

        {/* Begin - Expire */}
        <div>
          <span title='Begin (d/m/y)'>{formatTime(data.begin)}</span>
          {data.timeType === 'once' && data.expire && (
            <span title='Expire (d/m/y)'>
              {' - '} {formatTime(data.expire)}
            </span>
          )}
        </div>

        {/* Course Quantity */}
        <p className='font-semibold'>
          <span>Course Quantity:</span> <span className='text-primary'>{data.courseQuantity}</span>
        </p>

        {/* Applying Courses */}
        <div className='flex flex-wrap rounded-lg gap-2 max-h-[300px] overflow-y-auto mb-3'>
          {data.courses?.map(course => (
            <div
              className='border border-slate-300 bg-white rounded-lg flex items-start p-2 gap-2'
              key={course._id}>
              <Image
                className='aspect-video rounded-md border'
                src={course.images[0]}
                height={80}
                width={80}
                alt='thumbnail'
              />
              <span className='text-ellipsis line-clamp-2' title={course.title}>
                {course.title}
              </span>
            </div>
          ))}
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex self-end border border-dark text-dark rounded-lg px-3 py-2 gap-4'>
          {/* Edit Button Link */}
          <Link
            href={`/admin/flash-sale/${data._id}/edit`}
            className='block group'
            onClick={e => e.stopPropagation()}
            title='Edit'>
            <MdEdit size={18} className='wiggle' />
          </Link>

          {/* Delete Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingFlashSales.includes(data._id)}
            title='Delete'>
            {loadingFlashSales.includes(data._id) ? (
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
        title='Delete Flash Sale'
        content='Are you sure that you want to delete this flash sale?'
        onAccept={() => handleDeleteFlashSales([data._id])}
        isLoading={loadingFlashSales.includes(data._id)}
      />
    </>
  )
}

export default FlashSaleItem
