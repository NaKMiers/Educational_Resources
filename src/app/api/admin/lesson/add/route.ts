import { connectDatabase } from '@/config/database'
import LessonModel from '@/models/LessonModel'
import CourseModel from '@/models/CourseModel'
import { getTimes } from '@/utils/time'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Course
import '@/models/LessonModel'
import '@/models/CourseModel'

// [POST]: /admin/lesson/add
export async function POST(req: NextRequest) {
  console.log('- Add Lesson - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to add lesson
    const { type, info, renew, active, days, hours, minutes, seconds } = await req.json()
    const times = getTimes(+days, +hours, +minutes, +seconds)

    // create new lesson
    const newLesson = new LessonModel({
      type,
      info,
      renew: new Date(renew),
      times,
      active,
    })

    // save new lesson to database
    await newLesson.save()

    // increase course stock after add lesson
    await CourseModel.findByIdAndUpdate(type, {
      $inc: { stock: 1 },
    })

    // return response
    return NextResponse.json({ message: 'Add lesson successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
