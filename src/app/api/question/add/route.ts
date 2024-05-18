import { connectDatabase } from '@/config/database'
import QuestionModel from '@/models/QuestionModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Question
import '@/models/QuestionModel'

// [POST]: /question/add
export async function POST(req: NextRequest) {
  console.log('- Add Question -')

  try {
    // connect to database
    await connectDatabase()

    // get user
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
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
