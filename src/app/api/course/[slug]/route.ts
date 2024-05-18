import { connectDatabase } from '@/config/database'
import CommentModel from '@/models/CommentModel'
import CourseModel, { ICourse } from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Tag, Category, FlashSale, Comment, User,
import '@/models/CategoryModel'
import '@/models/CommentModel'
import '@/models/CourseModel'
import '@/models/FlashSaleModel'
import '@/models/TagModel'
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /course/:slug
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Course Page -')

  try {
    // connect to database
    await connectDatabase()

    // get course from database
    const course: ICourse | null = await CourseModel.findOne({
      slug: encodeURIComponent(slug),
      active: true,
    })
      .populate('tags categories flashSale')
      .lean()

    // check if course is not found
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }

    // get relatedCourses from database
    const relatedCourses: ICourse[] = await CourseModel.find({
      _id: { $ne: course._id },
      active: true,
      categories: course.categories,
    })
      .populate('flashSale')
      .lean()

    // get comment of the current course
    let comments = await CommentModel.find({
      courseId: course._id,
    })
      .populate('userId')
      .populate({
        path: 'replied',
        populate: {
          path: 'userId',
        },
        options: { sort: { likes: -1, createdAt: -1 }, limit: 6 },
      })
      .sort({ likes: -1, createdAt: -1 })
      .limit(12)
      .lean()

    comments = comments.map(comment => ({
      ...comment,
      userId: comment.userId._id,
      user: comment.userId,
      replied: comment.replied.map((reply: any) => ({
        ...reply,
        userId: reply.userId._id,
        user: reply.userId,
      })),
    }))

    return NextResponse.json({ course, relatedCourses, comments }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
