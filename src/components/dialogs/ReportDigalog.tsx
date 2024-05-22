import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { MdOutlineReportOff } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import Divider from '../Divider'

interface ReportDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  contents: string[]
  selectedContent: string
  setSelectedContent: Dispatch<SetStateAction<string>>
  acceptLabel?: string
  cancelLabel?: string
  onAccept: () => void
  isLoading?: boolean
  color?: string
  className?: string
}

function ReportDialog({
  open,
  setOpen,
  title,
  contents,
  selectedContent,
  setSelectedContent,
  acceptLabel,
  cancelLabel,
  onAccept,
  isLoading = false,
  color = 'orange',
  className = '',
}: ReportDialogProps) {
  // ref
  const modalRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)

  // show/hide modal
  useEffect(() => {
    if (open) {
      // show modal
      modalRef.current?.classList.remove('hidden')
      modalRef.current?.classList.add('flex')

      setTimeout(() => {
        // fade in modal
        modalRef.current?.classList.remove('opacity-0')

        // float in modal body
        modalBodyRef.current?.classList.remove('opacity-0')
        modalBodyRef.current?.classList.remove('translate-y-8')
      }, 1)
    } else {
      // fade out modal
      modalRef.current?.classList.add('opacity-0')

      // float out modal body
      modalBodyRef.current?.classList.add('opacity-0')
      modalBodyRef.current?.classList.add('translate-y-8')

      setTimeout(() => {
        // hide modal
        modalRef.current?.classList.add('hidden')
        modalRef.current?.classList.remove('flex')
      }, 350)
    }
  }, [open])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open) {
        // ESC
        if (e.key === 'Escape') {
          setOpen(false)
        }

        // Enter
        if (e.key === 'Enter') {
          onAccept()
          setOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen, onAccept, open])

  return (
    <div
      className='fixed z-40 top-0 left-0 h-screen text-dark w-screen hidden items-center justify-center p-21 bg-black bg-opacity-10 opacity-0 transition-all duration-300'
      ref={modalRef}
      onClick={() => setOpen(false)}>
      <div
        className={`rounded-medium shadow-medium-light bg-white p-21 max-w-[500px] w-full max-h-[500px] opacity-0 transition-all duration-300 translate-y-8 ${className}`}
        ref={modalBodyRef}
        onClick={e => e.stopPropagation()}>
        <h2 className='text-2xl font-semibold tracking-wide'>{title}</h2>

        <Divider size={4} border />

        {/* Select Content */}
        <div className={`flex`}>
          <span
            className={`inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 border-slate-200 bg-slate-100`}>
            <MdOutlineReportOff size={19} className='text-secondary' />
          </span>
          <div
            className={`relative w-full border-[2px] border-l-0 bg-white rounded-tr-lg rounded-br-lg border-slate-200`}>
            <select
              id='chapterId'
              className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
              disabled={isLoading}
              required
              value={selectedContent}
              onChange={e => setSelectedContent(e.target.value)}>
              <option value=''>Select Content</option>

              {contents.map((content, index) => (
                <option value={content} key={index}>
                  {content}
                </option>
              ))}
            </select>

            {/* label */}
            <label
              htmlFor='type'
              className={`absolute rounded-md text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer text-dark`}>
              Content
            </label>
          </div>
        </div>

        <Divider size={4} border />

        <div className='flex items-center justify-end gap-3 select-none'>
          <button
            className={`rounded-lg shadow-lg px-3 py-2 border border-slate-300 hover:bg-slate-300 hover:text-white trans-200 ${
              isLoading ? 'pointer-events-none' : ''
            }`}
            onClick={() => setOpen(false)}
            disabled={isLoading}>
            {cancelLabel || 'cancel'}
          </button>
          <button
            className={`rounded-lg shadow-lg px-3 py-2 border text-${color}-500 hover:bg-secondary hover:border-secondary hover:text-white trans-200 ${
              isLoading ? 'pointer-events-none border-slate-300' : `border-${color}-500`
            }`}
            onClick={() => {
              onAccept()
              setOpen(false)
            }}
            disabled={isLoading}>
            {isLoading ? (
              <RiDonutChartFill size={24} className='animate-spin text-slate-300' />
            ) : (
              acceptLabel || 'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportDialog
