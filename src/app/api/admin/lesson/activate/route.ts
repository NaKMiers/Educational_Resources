import { connectDatabase } from '@/config/database'
import LessonModel, { ILesson } from '@/models/LessonModel'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Course
import '@/models/LessonModel'
import '@/models/CourseModel'

// [PATCH]: /admin/lesson/activate
export async function PATCH(req: NextRequest) {
  console.log('- Activate Lessons - ')

  try {
    // connect to database
    await connectDatabase()

    // get lesson id to delete
    const { ids, value } = await req.json()

    // update lessons from database
    await LessonModel.updateMany({ _id: { $in: ids } }, { $set: { active: value || false } })

    // get updated lessons
    const lessons: ILesson[] = await LessonModel.find({ _id: { $in: ids } }).lean()

    if (!lessons.length) {
      throw new Error('No lesson found')
    }

    // return response
    return NextResponse.json(
      {
        updatedLessons: lessons,
        message: `${lessons.length} lesson${lessons.length > 1 ? 's' : ''} ${
          lessons.length > 1 ? 'have' : 'has'
        } been ${value ? 'activated' : 'deactivated'}`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
