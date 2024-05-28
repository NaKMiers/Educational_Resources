'use client'

import Comment from '@/components/Comment'
import Divider from '@/components/Divider'
import ReportDialog from '@/components/dialogs/ReportDigalog'
import { reportContents } from '@/constants'
import { IComment } from '@/models/CommentModel'
import { ICourse } from '@/models/CourseModel'
import { ILesson } from '@/models/LessonModel'
import { addReportApi, getLessonApi, likeLessonApi } from '@/requests'
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaHeart, FaQuestion, FaRegHeart } from 'react-icons/fa'
import { IoChevronBackCircleOutline } from 'react-icons/io5'

function LessonPage({
  params: { courseId, lessonId },
}: {
  params: { courseId: string; lessonId: string }
}) {
  // hooks
  const { data: session, update } = useSession()

  // states
  const [curUser, setCurUser] = useState<any>(session?.user || {})
  const [lesson, setLesson] = useState<ILesson | null>(null)
  const [comments, setComments] = useState<IComment[]>([])

  // report states
  const [isOpenReportDialog, setIsOpenReportDialog] = useState<boolean>(false)
  const [selectedContent, setSelectedContent] = useState<string>('')

  // update user session
  useEffect(() => {
    const getUser = async () => {
      const session = await getSession()
      const user: any = session?.user
      setCurUser(user)
    }

    if (!curUser?._id) {
      getUser()
    }
  }, [update, curUser])

  // get lesson
  useEffect(() => {
    const getLesson = async () => {
      // get lesson for learning
      try {
        const { lesson, comments } = await getLessonApi(lessonId)

        // set states
        setLesson(lesson)
        setComments(comments)
      } catch (err: any) {
        console.log(err)
      }
    }

    getLesson()
  }, [lessonId])

  // handle report lesson
  const handleReport = useCallback(async () => {
    // check if content is selected or not
    if (!selectedContent) {
      toast.error('Please select a content to report')
      return
    }

    try {
      const { message } = await addReportApi({
        type: 'lesson',
        content: selectedContent,
        link: `/admin/lesson/all?_id=${lesson?._id}`,
      })

      // show success
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [lesson?._id, selectedContent])

  // like / unlike lesson
  const likeLesson = useCallback(
    async (value: 'y' | 'n') => {
      if (lesson?._id) {
        try {
          // send request to like / dislike lesson
          const { updatedLesson } = await likeLessonApi(lesson._id, value)

          // like / dislike lesson
          setLesson(updatedLesson)
        } catch (err: any) {
          toast.error(err.message)
          console.log(err)
        }
      } else {
        toast.error('Lesson not found')
      }
    },
    [lesson?._id]
  )

  return (
    <div className='w-full'>
      <Divider size={5} />

      <div className='flex justify-between items-center px-3'>
        <h2 className='flex items-center gap-2 font-semibold text-3xl'>
          <Link href='/my-courses'>
            <IoChevronBackCircleOutline size={36} className='wiggle' />
          </Link>
          <span>{(lesson?.courseId as ICourse)?.title}</span>
        </h2>

        {curUser?._id && (
          <button
            className={`font-bold px-3 py-1.5 text-xs hover:bg-dark-0 hover:border-dark hover:text-rose-500 border border-rose-400 text-rose-400 rounded-md shadow-md trans-200`}
            title='Report'
            onClick={() => setIsOpenReportDialog(true)}>
            Report
          </button>
        )}

        {/* Report Dialog */}
        <ReportDialog
          open={isOpenReportDialog}
          setOpen={setIsOpenReportDialog}
          title='Report Question'
          contents={reportContents.lesson}
          selectedContent={selectedContent}
          setSelectedContent={setSelectedContent}
          onAccept={handleReport}
          isLoading={false}
        />
      </div>

      <Divider size={4} />

      {/* Source */}
      <div className='px-3'>
        <div className='aspect-video w-full rounded-lg shadow-lg overflow-hidden'>
          {lesson?.sourceType === 'embed' ? (
            <iframe
              className='w-full h-full object-contain'
              src={lesson?.source}
              title='The Largest Black Hole in the Universe - Size Comparison'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen
            />
          ) : null}
        </div>
      </div>

      <Divider size={4} />

      <div className='flex justify-between font-semibold gap-21 px-3'>
        <div className='group flex items-center justify-center gap-1'>
          {lesson?.likes.includes(curUser?._id) ? (
            <FaHeart
              size={20}
              className='text-rose-400 cursor-pointer wiggle'
              onClick={() => likeLesson('n')}
            />
          ) : (
            <FaRegHeart
              size={20}
              className='text-rose-400 cursor-pointer wiggle'
              onClick={() => likeLesson('y')}
            />
          )}{' '}
          <span>{lesson?.likes.length}</span>
        </div>

        <Link
          href='/question'
          className='px-2 py-1 bg-slate-200 flex items-center rounded-lg hover:bg-dark-100 hover:text-white trans-200 shadow-lg'>
          <span className='font-semibold text-lg'>Ask Question </span>
          <FaQuestion size={18} />
        </Link>
      </div>

      <Divider size={2} />

      {/* Title */}
      <h1 className='text-ellipsis line-clamp-2 w-full text-4xl font-body tracking-wider px-3' title=''>
        {lesson?.title}
      </h1>

      <Divider size={4} />

      {/* Description */}
      <div className='px-4'>{lesson?.description}</div>

      {/* <Divider size={8} /> */}

      {/* Question */}

      <Divider size={8} />

      <div className='px-3'>
        <h3 className='font-semibold text-xl mb-2 text-slate-800'>Comments</h3>

        <Comment comments={comments} lessonId={lesson?._id} />
      </div>

      <Divider size={8} />
    </div>
  )
}

export default LessonPage
