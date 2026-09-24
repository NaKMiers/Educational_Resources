import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course
import '@/models/CourseModel'

export const dynamic = 'force-dynamic'

// [GET]: /course/:id
export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params

  console.log('- Get Course Single -')

  try {
    // connect to database
    await connectDatabase()

    // get course from database
    const course = await CourseModel.findOne({ slug }).lean()

    // return course
    return NextResponse.json({ course }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
