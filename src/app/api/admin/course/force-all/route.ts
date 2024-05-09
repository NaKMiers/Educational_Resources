import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { NextResponse } from 'next/server'

// Models: Course, Tag, Category
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/TagModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/course/force-all
export async function GET() {
  console.log('- Get Force All Courses -')

  try {
    // connect to database
    await connectDatabase()

    // get all courses from database
    const courses = await CourseModel.find()
      .select('title images')
      .populate({
        path: 'tags',
        select: 'title',
      })
      .populate({
        path: 'categories',
        select: 'title',
      })
      .sort({ sold: -1 })
      .lean()

    // return all courses
    return NextResponse.json({ courses }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
