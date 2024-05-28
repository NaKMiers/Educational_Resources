import { connectDatabase } from '@/config/database'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Comment, User
import '@/models/LessonModel'
import '@/models/CommentModel'
import '@/models/UserModel'
import CommentModel from '@/models/CommentModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/lesson/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get Lesson -')

  try {
    // connect to database
    await connectDatabase()

    // get lesson from database
    const lesson: ILesson | null = await LessonModel.findById(id)
      .populate({
        path: 'courseId',
      })
      .lean()

    // check lesson
    if (!lesson) {
      return NextResponse.json({ message: 'Lesson not found' }, { status: 404 })
    }

    // get comment of the current lesson
    let comments = await CommentModel.find({
      lessonId: lesson._id,
    })
      .populate('userId')
      .populate({
        path: 'replied',
        populate: {
          path: 'userId',
        },
        options: { sort: { likes: -1, createdAt: -1 }, limit: 6 },
      })
      .sort({ likes: -1, createdAt: -1 })
      .limit(8)
      .lean()

    comments = comments.map(comment => ({
      ...comment,
      userId: comment.userId._id,
      user: comment.userId,
      replied: comment.replied.map((reply: any) => ({
        ...reply,
        userId: reply.userId._id,
        user: reply.userId,
      })),
    }))

    // return lesson
    return NextResponse.json({ lesson, comments, message: 'Lesson found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
