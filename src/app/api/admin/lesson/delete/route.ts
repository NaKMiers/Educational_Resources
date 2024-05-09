import { connectDatabase } from '@/config/database'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Course
import '@/models/CourseModel'
import '@/models/LessonModel'

// [DELETE]: /admin/lesson/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Lessons - ')

  try {
    // connect to database
    await connectDatabase()

    // get lesson ids to delete
    const { ids } = await req.json()

    // Find lessons by their IDs before deletion
    const lessons: ILesson[] = await LessonModel.find({
      _id: { $in: ids },
    }).lean()

    // delete lesson by ids
    await LessonModel.deleteMany({
      _id: { $in: ids },
    })

    // return response
    return NextResponse.json(
      {
        deletedLessons: lessons,
        message: `${lessons.length} lesson${lessons.length > 1 ? 's' : ''} ${
          lessons.length > 1 ? 'have' : 'has'
        } been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
