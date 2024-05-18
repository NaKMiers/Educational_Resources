import { connectDatabase } from '@/config/database'
import QuestionModel from '@/models/QuestionModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Question, User
import '@/models/QuestionModel'
import '@/models/UserModel'

// [PATCH]: /Question/:id/close
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Like Question -')

  try {
    // connect to database
    await connectDatabase()

    // get current user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // get id and value to close
    const { value } = await req.json()

    // user does not exist
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      id,
      { $set: { status: value } },
      { new: true }
    ).lean()

    if (!updatedQuestion) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 })
    }

    // return response
    return NextResponse.json(
      { updatedQuestion, message: `Question has been ${value === 'close' ? 'closed' : 'opend'}` },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
