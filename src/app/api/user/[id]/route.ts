import { connectDatabase } from '@/config/database'
import QuestionModel, { IQuestion } from '@/models/QuestionModel'
import UserModel, { IUser } from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Course, Question
import '@/models/CourseModel'
import '@/models/QuestionModel'
import '@/models/UserModel'

// [GET]: /api/user/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get User -')

  try {
    // connect to database
    await connectDatabase()

    // get user by id
    const user: IUser | null = await UserModel.findById(id)
      .populate({
        path: 'courses.course',
      })
      .populate('gifts')
      .lean()

    // check if user exists
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const questions: IQuestion[] = await QuestionModel.find({ userId: id }).populate('userId').lean()
    user.questions = questions

    // return user
    return NextResponse.json({ user, message: 'Get user successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
