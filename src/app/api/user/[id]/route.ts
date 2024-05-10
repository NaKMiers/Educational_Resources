import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Course
import '@/models/CourseModel'
import '@/models/UserModel'

// [GET]: /api/user/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get User -')

  try {
    // connect to database
    await connectDatabase()

    // get user by id
    const user = await UserModel.findById(id)
      .populate({
        path: 'courses.course',
      })
      .populate('gifts')
      .lean()

    // return user
    return NextResponse.json({ user, message: 'Get user successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
