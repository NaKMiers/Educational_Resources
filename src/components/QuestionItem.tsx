'use client'

import { reportContents } from '@/constants'
import { IQuestion } from '@/models/QuestionModel'
import { IUser } from '@/models/UserModel'
import { closeQuestionsApi, likeQuestionsApi } from '@/requests/questionRequest'
import { addReportApi } from '@/requests/reportRequest'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaRegCommentDots, FaRegThumbsUp } from 'react-icons/fa'
import { format } from 'timeago.js'
import ReportDialog from './dialogs/ReportDigalog'

interface QuestionItemProps {
  question: IQuestion
  className?: string
}

function QuestionItem({ question, className = '' }: QuestionItemProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [data, setData] = useState<IQuestion>(question)
  const { userId, content, likes, commentAmount, status } = data
  const user: IUser = userId as IUser

  // report states
  const [isOpenReportDialog, setIsOpenReportDialog] = useState<boolean>(false)
  const [selectedContent, setSelectedContent] = useState<string>('')

  // handle like / dislike
  const handleLike = useCallback(async () => {
    try {
      const { updatedQuestion } = await likeQuestionsApi(data._id, likes.includes(curUser?._id))

      // update state
      setData(prev => ({ ...prev, likes: updatedQuestion.likes }))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [data._id, likes, curUser?._id])

  const handleClose = useCallback(async () => {
    try {
      const { updatedQuestion } = await closeQuestionsApi(data._id, status === 'open' ? 'close' : 'open')

      // update state
      setData(prev => ({ ...prev, status: updatedQuestion.status }))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [data._id, status])

  // handle report question
  const handleReport = useCallback(async () => {
    // check if content is selected or not
    if (!selectedContent) {
      toast.error('Please select a content to report')
      return
    }

    try {
      console.log('report')

      const { message } = await addReportApi({
        type: 'question',
        content: selectedContent,
        link: `/question/${question.slug}`,
      })

      // show success
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [selectedContent, question.slug])

  return (
    <div className={`rounded-2xl shadow-lg bg-white bg-opacity-80 ${className}`}>
      {/* Top */}
      <div className='relative flex gap-3 p-4 border-b-2 border-slate-300'>
        <Link
          href={`/user/${user._id}`}
          className='flex-shrink-0 w-[40px] h-[40px] rounded-full aspect-square overflow-hidden shadow-lg'>
          <Image
            className='w-full h-full object-cover'
            src={user.avatar}
            width={75}
            height={75}
            alt='avatar'
          />
        </Link>
        <Link href={`/user/${user._id}`}>
          <p className='text-lg font-bold -mt-1.5'>
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
          </p>
          <p className='text-slate-500 text-sm font-semibold'>{format(question.createdAt)}</p>
        </Link>
        {curUser?._id && (
          <div className='absolute top-2 right-2 flex gap-2'>
            {(user._id === curUser._id || user.role === 'admin') && (
              <button
                className={`font-bold px-1.5 py-1 text-[10px] bg-slate-200 hover:text-white border rounded-md shadow-md trans-200 ${
                  status === 'open'
                    ? 'border-dark hover:bg-black'
                    : 'border-green-500 text-green-500 hover:bg-green-500'
                }`}
                title={status === 'open' ? 'opening' : 'closing'}
                onClick={handleClose}>
                {status === 'open' ? 'close' : 'open'}
              </button>
            )}

            <button
              className={`font-bold px-1.5 py-1 text-[10px] hover:bg-dark-0 hover:border-dark hover:text-rose-500 border border-rose-400 text-rose-400 rounded-md shadow-md trans-200`}
              title='Report'
              onClick={() => setIsOpenReportDialog(true)}>
              Report
            </button>
          </div>
        )}
      </div>

      {/* Center */}
      <div className='px-5 py-6 font-body tracking-wider border-b-2 border-slate-300'>{content}</div>

      {/* Bottom */}
      <div className='flex h-[50px]'>
        <div className='flex justify-center items-center w-full border-r-2 border-slate-300'>
          <button className='flex items-center justify-center group'>
            <span className='mr-1.5 font-semibold'>{likes.length}</span>{' '}
            <FaRegThumbsUp
              size={18}
              className={`${
                !likes.includes(curUser?._id)
                  ? 'text-dark group-hover:text-rose-500'
                  : 'text-rose-500 group-hover:text-dark'
              } trans-200`}
              onClick={handleLike}
            />
          </button>
        </div>

        <div className='flex justify-center items-center w-full'>
          <Link href={`/question/${question.slug}`} className='flex items-center justify-center'>
            <span className='mr-1.5 font-semibold'>{commentAmount}</span> <FaRegCommentDots size={18} />
          </Link>
        </div>
      </div>

      {/* Confirm Demote Collaborator Dialog */}
      <ReportDialog
        open={isOpenReportDialog}
        setOpen={setIsOpenReportDialog}
        title='Report Question'
        contents={reportContents.question}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
        onAccept={handleReport}
        isLoading={false}
      />
    </div>
  )
}

export default QuestionItem
