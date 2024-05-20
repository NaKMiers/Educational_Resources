import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Category
import '@/models/CourseModel'
import '@/models/CategoryModel'

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

    return NextResponse.json({ courses }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
