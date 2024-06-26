'use client'

import { IQuestion } from '@/models/QuestionModel'
import { IUser } from '@/models/UserModel'
import { likeQuestionsApi } from '@/requests/questionRequest'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaRegCommentDots, FaRegThumbsUp } from 'react-icons/fa'

interface BottomOfQuestionProps {
  question: IQuestion
  commentAmount: number
  className?: string
}

function BottomOfQuestion({ question, commentAmount, className = '' }: BottomOfQuestionProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [data, setData] = useState<IQuestion>(question)
  const { userId, content, likes, status } = data
  const user: IUser = userId as IUser

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

  return (
    <div className='flex h-[50px] gap-4'>
      <button className='flex items-center justify-center group -mb-1'>
        <span className='mr-1.5 font-semibold'>{likes.length}</span>{' '}
        <FaRegThumbsUp
          size={18}
          className={`${
            !likes.includes(curUser?._id)
              ? 'text-dark group-hover:text-rose-500'
              : 'text-rose-500 group-hover:text-dark'
          } -mt-1.5 trans-200`}
          onClick={handleLike}
        />
      </button>

      <Link href={`/question/${question.slug}`} className='flex items-center justify-center'>
        <span className='mr-1.5 font-semibold'>{commentAmount}</span> <FaRegCommentDots size={18} />
      </Link>
    </div>
  )
}

export default BottomOfQuestion
