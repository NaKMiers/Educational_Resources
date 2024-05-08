import { ICategory } from '@/models/CategoryModel'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'
import Image from 'next/image'

interface CategoryItemProps {
  data: ICategory
  loadingCategories: string[]
  className?: string

  selectedCategories: string[]
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>

  handleDeleteCategories: (ids: string[]) => void
}

function CategoryItem({
  data,
  loadingCategories,
  className = '',
  // selected
  selectedCategories,
  setSelectedCategories,
  handleDeleteCategories,
}: CategoryItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`flex flex-col p-4 rounded-lg shadow-lg text-dark cursor-pointer common-transition ${
          selectedCategories.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        } ${className}`}
        onClick={() =>
          setSelectedCategories(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }
        key={data._id}>
        {/* MARK: Body */}
        <p className='font-semibold' title={data.slug}>
          {data.title}
        </p>

        {/* Product Quantity */}
        <p className='font-semibold mb-2' title={`Product Quantity: ${data.courseQuantity}`}>
          <span>Pr.Q:</span> <span className='text-primary'>{data.courseQuantity}</span>
        </p>
        {/* MARK: Action Buttson */}
        <div className='flex self-end border overflow-x-auto max-w-full border-dark rounded-lg px-3 py-2 gap-4'>
          {/* Edit Button Link */}
          <Link
            href={`/admin/category/${data.slug}/edit`}
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
            disabled={loadingCategories.includes(data._id)}
            title='Delete'>
            {loadingCategories.includes(data._id) ? (
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
        title='Delete Category'
        content='Are you sure that you want to delete this category?'
        onAccept={() => handleDeleteCategories([data._id])}
        isLoading={loadingCategories.includes(data._id)}
      />
    </>
  )
}

export default CategoryItem
