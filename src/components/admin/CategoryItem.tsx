import { ICategory } from '@/models/CategoryModel'
import React, { useState } from 'react'
import { FaCheck, FaSave, FaTrash } from 'react-icons/fa'
import { MdCancel, MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'

interface CategoryItemProps {
  data: ICategory
  loadingCategories: string[]
  className?: string

  selectedCategories: string[]
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>

  editingCategories: string[]
  setEditingCategories: React.Dispatch<React.SetStateAction<string[]>>

  editingValues: { _id: string; title: string }[]
  setEditingValues: React.Dispatch<React.SetStateAction<{ _id: string; title: string }[]>>

  handleSaveEditingCategories: (editingValues: { _id: string; value: string }[]) => void
  handleDeleteCategories: (ids: string[]) => void
  handleBootCategories: (ids: string[], isFeatured: boolean) => void
}

function CategoryItem({
  data,
  loadingCategories,
  className = '',
  // selected
  selectedCategories,
  setSelectedCategories,
  // editing
  editingCategories,
  setEditingCategories,
  // values
  editingValues,
  setEditingValues,
  // functions
  handleSaveEditingCategories,
  handleDeleteCategories,
  handleBootCategories,
}: CategoryItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`flex flex-col p-4 rounded-lg shadow-lg text-dark cursor-pointer common-transition ${
          selectedCategories.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        } ${className}`}
        key={data._id}
        onClick={() =>
          setSelectedCategories(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        {/* MARK: Body */}
        {editingCategories.includes(data._id) ? (
          // Category Title Input
          <input
            className='w-full mb-2 rounded-lg py-2 px-4 text-dark outline-none border border-slate-300'
            type='text'
            value={editingValues.find(t => t._id === data._id)?.title}
            onClick={e => e.stopPropagation()}
            disabled={loadingCategories.includes(data._id)}
            onChange={e =>
              setEditingValues(prev =>
                prev.map(t => (t._id === data._id ? { _id: data._id, title: e.target.value } : t))
              )
            }
          />
        ) : (
          // Category Title
          <p className='font-semibold' title={data.slug}>
            {data.title}
          </p>
        )}

        {/* Product Quantity */}
        <p className='font-semibold mb-2' title={`Product Quantity: ${data.courseQuantity}`}>
          <span>Pr.Q:</span> <span className='text-primary'>{data.courseQuantity}</span>
        </p>

        {/* MARK: Action Buttons */}
        <div className='flex self-end border border-dark rounded-lg px-3 py-2 gap-4'>
          {/* Feature Button */}
          {!editingCategories.includes(data._id) && (
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
                handleBootCategories([data._id], !data.booted)
              }}
              disabled={loadingCategories.includes(data._id)}
              title={data.booted ? 'Mark Featured' : 'Mark Unfeatured'}>
              <FaCheck
                size={18}
                className={`wiggle ${data.booted ? 'text-green-500' : 'text-slate-300'}`}
              />
            </button>
          )}

          {/* Edit Button */}
          {!editingCategories.includes(data._id) && (
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
                setEditingCategories(prev => (!prev.includes(data._id) ? [...prev, data._id] : prev))
                setEditingValues(prev =>
                  !prev.some(cate => cate._id === data._id)
                    ? [...prev, { _id: data._id, title: data.title }]
                    : prev
                )
              }}
              title='Edit'>
              <MdEdit size={18} className='wiggle' />
            </button>
          )}

          {/* Save Button */}
          {editingCategories.includes(data._id) && (
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
                handleSaveEditingCategories([editingValues.find(cate => cate._id === data._id)] as any[])
              }}
              disabled={loadingCategories.includes(data._id)}
              title='Save'>
              {loadingCategories.includes(data._id) ? (
                <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
              ) : (
                <FaSave size={18} className='wiggle text-green-500' />
              )}
            </button>
          )}

          {/* Cancel Button */}
          {editingCategories.includes(data._id) && !loadingCategories.includes(data._id) && (
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
                setEditingCategories(prev =>
                  prev.includes(data._id) ? prev.filter(id => id !== data._id) : prev
                )
                setEditingValues(prev => prev.filter(cate => cate._id !== data._id))
              }}
              title='Cancel'>
              <MdCancel size={20} className='wiggle text-slate-300' />
            </button>
          )}

          {/* Delete Button */}
          {!editingCategories.includes(data._id) && (
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
          )}
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
