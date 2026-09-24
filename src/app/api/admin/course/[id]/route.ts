import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course
import '@/models/CourseModel'

export const dynamic = 'force-dynamic'

// [GET]: /course/:id
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  console.log('- Get Course -')

  try {
    // connect to database
    await connectDatabase()

    // get course from database
    const course = await CourseModel.findById(id).lean()

    // return course
    return NextResponse.json({ course, message: 'Course found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
