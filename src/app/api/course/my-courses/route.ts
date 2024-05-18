// Models:

import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import UserModel, { IUser } from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Category, Tag, User
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/TagModel'
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /course/my-courses
export async function GET(req: NextRequest) {
  console.log('- Get My Courses -')

  try {
    // connect to database
    await connectDatabase()

    // get user to check authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // get user to get course id list
    const user: IUser | null = await UserModel.findById(userId).select('courses').lean()

    // check if user is logged in
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const userCourses = user.courses.map((course: any) => course.course)

    // get user's courses
    let courses = await CourseModel.find({ _id: { $in: userCourses } })
      .populate('tags categories')
      .sort({ createdAt: -1 })
      .lean()

    // return user's courses
    return NextResponse.json({ courses }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
