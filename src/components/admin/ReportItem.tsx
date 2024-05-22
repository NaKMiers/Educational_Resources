import { IReport } from '@/models/ReportModel'
import React, { useState } from 'react'
import { FaEye, FaTrash } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import Link from 'next/link'

interface ReportItemProps {
  data: IReport
  loadingReports: string[]
  className?: string
  selectedReports: string[]
  setSelectedReports: React.Dispatch<React.SetStateAction<string[]>>
  handleDeleteReports: (ids: string[]) => void
}

function ReportItem({
  data,
  loadingReports,
  className = '',
  // selected
  selectedReports,
  setSelectedReports,
  // functions
  handleDeleteReports,
}: ReportItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`flex flex-col p-4 rounded-lg shadow-lg text-dark cursor-pointer trans-200 ${
          selectedReports.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        } ${className}`}
        key={data._id}
        onClick={() =>
          setSelectedReports(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        {/* Type */}
        <div className='mb-2'>
          <p
            className='inline-block font-semibold text-xs bg-primary font-body tracking-wider rounded-lg shadow-lg px-2 py-1'
            title=''>
            {data.type}
          </p>
        </div>

        {/* Content */}
        <p className='font-semibold' title=''>
          <span>Content:</span> <span className='text-slate-400'>{data.content}</span>
        </p>

        {/* MARK: Action Buttons */}
        <div className='flex self-end border border-dark rounded-lg px-3 py-2 gap-4 mt-2'>
          {/* Detail Button */}
          <Link
            href={data.link}
            className='block group'
            onClick={e => e.stopPropagation()}
            title='Detail'>
            <FaEye size={18} className='text-primary wiggle' />
          </Link>

          {/* Delete Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingReports.includes(data._id)}
            title='Delete'>
            {loadingReports.includes(data._id) ? (
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
        title='Delete Report'
        content='Are you sure that you want to delete this Report?'
        onAccept={() => handleDeleteReports([data._id])}
        isLoading={loadingReports.includes(data._id)}
      />
    </>
  )
}

export default ReportItem
