import { EditingValues } from '@/app/(admin)/admin/chapter/[courseId]/all/page'
import { IChapter } from '@/models/ChapterModel'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'

interface ChapterItemProps {
  data: IChapter
  loadingChapters: string[]
  className?: string

  selectedChapters: string[]
  setSelectedChapters: React.Dispatch<React.SetStateAction<string[]>>
  setEditingValues: React.Dispatch<React.SetStateAction<EditingValues | null>>

  handleDeleteChapters: (ids: string[]) => void
}

function ChapterItem({
  data,
  loadingChapters,
  className = '',
  // selected
  selectedChapters,
  setSelectedChapters,
  setEditingValues,
  // functions
  handleDeleteChapters,
}: ChapterItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`flex flex-col p-4 rounded-lg shadow-lg text-dark cursor-pointer common-transition ${
          selectedChapters.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        } ${className}`}
        key={data._id}
        onClick={() =>
          setSelectedChapters(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        {/* Chapter Title */}
        <p className='font-semibold' title={data.slug}>
          {data.title}
        </p>

        {/* Course Quantity */}
        <p className='font-semibold mb-2' title={`Course Quantity: ${data.lessonQuantity}`}>
          <span>Ls.Q:</span> <span className='text-primary'>{data.lessonQuantity}</span>
        </p>

        {/* Order */}
        <p className='font-semibold mb-2' title={`Order: ${data.order}`}>
          <span>Order:</span> <span className='text-primary'>{data.order}</span>
        </p>

        {/* MARK: Action Buttons */}
        <div className='flex self-end border border-dark rounded-lg px-3 py-2 gap-4'>
          {/* Edit Button */}
          <button
            className='block group'
            title='Edit'
            onClick={e => {
              e.stopPropagation()

              setEditingValues({
                _id: data._id,
                title: data.title,
                content: data.content,
                order: data.order,
              })
            }}>
            <MdEdit size={18} className='wiggle' />
          </button>

          {/* Delete Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingChapters.includes(data._id)}
            title='Delete'>
            {loadingChapters.includes(data._id) ? (
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
        title='Delete Chapter'
        content='Are you sure that you want to delete this category?'
        onAccept={() => handleDeleteChapters([data._id])}
        isLoading={loadingChapters.includes(data._id)}
      />
    </>
  )
}

export default ChapterItem
