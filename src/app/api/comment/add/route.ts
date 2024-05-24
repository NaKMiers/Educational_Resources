import { connectDatabase } from '@/config/database'
import CommentModel from '@/models/CommentModel'
import QuestionModel, { IQuestion } from '@/models/QuestionModel'
import UserModel, { IUser } from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Comment, Question, User
import '@/models/CommentModel'
import '@/models/QuestionModel'
import '@/models/UserModel'

// [POST]: /comment/add
export async function POST(req: NextRequest) {
  console.log('- Add Comment - ')

  try {
    // connect to database
    await connectDatabase()

    // get user id to add comment
    const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
    const userId = token?._id

    // get product id and content to add comment
    const { questionId, lessonId, content } = await req.json()

    // get user commented
    const user: IUser | null = await UserModel.findById(userId).lean()

    // user does not exist
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    // check if user is allowed to comment
    if (user.blockStatuses.blockedComment) {
      return NextResponse.json({ message: 'You are not allowed to comment' }, { status: 403 })
    }

    // check if productId or content is empty
    if ((!questionId && !lessonId) || !content) {
      // return error
      return NextResponse.json({ message: 'Invalid content' }, { status: 400 })
    }

    // create new comment
    const comment = new CommentModel({
      userId,
      questionId,
      lessonId,
      content: content.trim(),
    })

    // save new comment to database
    await comment.save()

    // if user comment on question
    if (questionId) {
      // get user to notify base on questionId
      const question: IQuestion | null = await QuestionModel.findById(questionId)
        .select('userId slug')
        .lean()
      if (!question) {
        return NextResponse.json({ message: 'Question not found' }, { status: 404 })
      }

      const notifyUserId = question?.userId

      // notify user
      await UserModel.findByIdAndUpdate(notifyUserId, {
        $push: {
          notifications: {
            _id: new Date().getTime(),
            title:
              (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username) +
              ' replied on your comment',
            image: user.avatar,
            link: `/question/${question.slug}`,
            type: 'comment-question',
          },
        },
      })
    }

    // return new comment
    return NextResponse.json({ newComment: comment, message: 'Comment Successfully!' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
