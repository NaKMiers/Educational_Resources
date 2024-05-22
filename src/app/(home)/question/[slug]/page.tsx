import BottomOfQuestion from '@/components/BottomOfQuestion'
import Comment from '@/components/Comment'
import Divider from '@/components/Divider'
import { IComment } from '@/models/CommentModel'
import { IQuestion } from '@/models/QuestionModel'
import { IUser } from '@/models/UserModel'
import { getQuestionDetailPage } from '@/requests'
import Image from 'next/image'
import { format } from 'timeago.js'

async function QuestionDetailPage({ params: { slug } }: { params: { slug: string } }) {
  let question: IQuestion | null = null
  let comments: IComment[] = []
  let user: IUser | null = null

  try {
    const data = await getQuestionDetailPage(slug)
    question = data.question
    user = question?.userId as IUser
    comments = data.comments
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='max-w-1200 mx-auto'>
      <Divider size={10} />

      <div className='rounded-lg shadow-lg'>
        {/* Question */}
        <div className='w-full px-21'>
          {/* User Info */}
          <div className='flex gap-3 py-3'>
            <div className='w-[40px] h-[40px] rounded-full shadow-lg overflow-hidden'>
              <Image
                src={user?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                width={40}
                height={40}
                alt='avatar'
              />
            </div>
            <div className='-mt-1 font-body tracking-wider'>
              <p className='font-semibold'>
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username}
              </p>
              <p className='text-slate-400'>{format(question?.createdAt || 0)}</p>
            </div>
          </div>

          <Divider size={0} border />

          <p className='font-body tracking-wider py-21 text-lg'>{question?.content}</p>

          <Divider size={0} border />

          {/* Bottom of question */}
          {question && <BottomOfQuestion question={question} commentAmount={comments.length} />}
        </div>

        <Divider size={6} />

        {/* Comments */}
        <div className='px-21 pb-21'>
          {question && <Comment comments={comments} questionId={(question as any)._id} />}
        </div>
      </div>

      <Divider size={28} />
    </div>
  )
}

export default QuestionDetailPage
