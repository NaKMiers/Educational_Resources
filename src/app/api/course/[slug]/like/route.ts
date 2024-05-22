import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, User
import '@/models/CourseModel'
import '@/models/UserModel'

// [PATCH]: /course/:id/like
export async function PATCH(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Like Course -')

  try {
    // connect to database
    await connectDatabase()

    // get current user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
    const userId = token?._id

    // get id and value to like to dislike
    const { value } = await req.json()

    // user does not exist
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    let updatedCourse: any = null
    if (value === 'y') {
      // like
      updatedCourse = await CourseModel.findByIdAndUpdate(
        slug,
        { $addToSet: { likes: userId } },
        { new: true }
      ).lean()
    } else if (value === 'n') {
      // dislike
      updatedCourse = await CourseModel.findByIdAndUpdate(
        slug,
        { $pull: { likes: userId } },
        { new: true }
      ).lean()
    }

    if (!updatedCourse) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }

    // return response
    return NextResponse.json(
      { updatedCourse, message: `${value === 'y' ? 'Like' : 'Dislike'} successfully` },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
