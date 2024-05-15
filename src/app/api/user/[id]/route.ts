import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import UserModel, { IUser } from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Course, Question
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/QuestionModel'
import '@/models/UserModel'

// [GET]: /api/user/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get User -')

  try {
    // connect to database
    await connectDatabase()

    // get user by id
    let user: IUser | null = await UserModel.findById(id)
      .populate({
        path: 'courses.course',
      })
      .populate('gifts')
      .lean()

    // check if user exists
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // get all categories to stick to the user.courses.couse.categories
    const categories = await CategoryModel.find().lean()

    // loop through user.courses.course and add categories to each course
    user.courses.forEach(
      (course: any) =>
        (course.course.categories = categories.filter((category: any) =>
          course.course.categories.map((cate: any) => cate.toString()).includes(category._id.toString())
        ))
    )

    // return user
    return NextResponse.json({ user, message: 'Get user successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
