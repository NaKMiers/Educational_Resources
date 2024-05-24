import { connectDatabase } from '@/config/database'
import QuestionModel from '@/models/QuestionModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Question
import '@/models/QuestionModel'
import UserModel, { IUser } from '@/models/UserModel'

// [POST]: /question/add
export async function POST(req: NextRequest) {
  console.log('- Add Question -')

  try {
    // connect to database
    await connectDatabase()

    // get user
    const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    const user: IUser | null = await UserModel.findById(userId).lean()

    // check userId
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // check if user is allowed to add question
    if (user.blockStatuses.blockedAddingQuestion) {
      return NextResponse.json({ message: 'You are not allowed to add question' }, { status: 401 })
    }

    // get data to add question
    const { content } = await req.json()

    // add new question to database
    const question = new QuestionModel({
      content,
      userId,
    })

    await question.save()

    // return question
    return NextResponse.json({ question }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
