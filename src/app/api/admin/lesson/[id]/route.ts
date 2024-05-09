import { connectDatabase } from '@/config/database'
import LessonModel from '@/models/LessonModel'
import '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson
import '@/models/LessonModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/lesson/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get Lesson -')

  try {
    // connect to database
    await connectDatabase()

    // get lesson from database
    const lesson = await LessonModel.findById(id).lean()

    // check lesson
    if (!lesson) {
      return NextResponse.json({ message: 'Lesson not found' }, { status: 404 })
    }
    // return lesson
    return NextResponse.json({ lesson, message: 'Lesson found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
