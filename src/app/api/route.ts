import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Category, Question
import '@/models/CourseModel'
import '@/models/CategoryModel'
import '@/models/QuestionModel'
import Question from '@/components/Question'
import QuestionModel from '@/models/QuestionModel'

export const dynamic = 'force-dynamic'

// [GET]: /
export async function GET(req: NextRequest) {
  console.log(' - Get Home Page - ')

  try {
    // connect to database
    await connectDatabase()

    // get courses
    const courses = await CourseModel.find({
      active: true,
    })
      .populate('categories')
      .sort({
        joined: -1,
      })
      .limit(8)
      .lean()

    // best-seller courses
    const bestSellers = courses.slice(0, 3)

    // best questions
    const questions = await QuestionModel.find({
      status: 'open',
    })
      .populate('userId')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ courses, bestSellers, questions }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
