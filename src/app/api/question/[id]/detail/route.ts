import { connectDatabase } from '@/config/database'
import QuestionModel, { IQuestion } from '@/models/QuestionModel'
import { NextRequest, NextResponse } from 'next/server'
import CommentModel from '@/models/CommentModel'

// Models: Question, User, Comment
import '@/models/QuestionModel'
import '@/models/UserModel'
import '@/models/CommentModel'

export const dynamic = 'force-dynamic'

// [GET]: /question/:slug/detail
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get Question Detail Page - ')

  try {
    // connect to database
    await connectDatabase()

    // get question
    const question: IQuestion | null = await QuestionModel.findOne({ slug: id })
      .populate({
        path: 'userId',
      })
      .lean()

    // check if question exists or not
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 })
    }

    // get comment of the current question
    let comments = await CommentModel.find({
      questionId: question._id,
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

    // return question
    return NextResponse.json({ question, comments }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
