import { connectDatabase } from '@/config/database'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import QuestionModel from '@/models/QuestionModel'
import UserModel, { IUser } from '@/models/UserModel'

// Models: Question, User
import '@/models/QuestionModel'
import '@/models/UserModel'

// [PATCH]: /Question/:id/like
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Like Question -')

  try {
    // connect to database
    await connectDatabase()

    // get current user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // get id and value to like to dislike
    const { value } = await req.json()

    // get user liked / disliked
    const user: IUser | null = await UserModel.findById(userId)
      .select('username avatar firstName lastName')
      .lean()

    // user does not exist
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    let updatedQuestion: any = null
    if (!value) {
      // like
      updatedQuestion = await QuestionModel.findByIdAndUpdate(
        id,
        { $addToSet: { likes: userId } },
        { new: true }
      ).lean()
    } else {
      // dislike
      updatedQuestion = await QuestionModel.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { new: true }
      ).lean()
    }

    if (!updatedQuestion) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 })
    }

    // notify user only if like
    if (!value && updatedQuestion.userId !== userId) {
      await UserModel.findByIdAndUpdate(updatedQuestion.userId, {
        $push: {
          notifications: {
            _id: new Date().getTime(),
            title:
              (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username) +
              ' liked on your question',
            image: user.avatar,
            type: 'emotion-question',
          },
        },
      })
    }

    // return response
    return NextResponse.json(
      { updatedQuestion, message: `Question has been ${!value ? 'liked' : 'disliked'}` },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
