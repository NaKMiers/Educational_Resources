import { connectDatabase } from '@/config/database'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Order
import '@/models/LessonModel'
import '@/models/OrderModel'

// [PUT]: /lesson/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Lesson -')

  try {
    // connect to database
    await connectDatabase()

    // get data to edit lesson
    const { courseId, description, active } = await req.json()

    // update lesson
    const updatedLesson: ILesson | null = await LessonModel.findByIdAndUpdate(
      id,

      { new: true }
    )

    // return updated lesson
    return NextResponse.json(
      {
        updatedLesson,
        message: 'Lesson has been updated',
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
