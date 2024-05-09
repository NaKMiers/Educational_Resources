import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course
import '@/models/CourseModel'

// [PATCH]: /admin/course/activate
export async function PATCH(req: NextRequest) {
  console.log('- Activate Courses - ')

  try {
    // connect to database
    await connectDatabase()

    // get course id to delete
    const { ids, value } = await req.json()

    // update courses from database
    await CourseModel.updateMany({ _id: { $in: ids } }, { $set: { active: value || false } })

    // get updated courses
    const updatedCourses = await CourseModel.find({ _id: { $in: ids } }).lean()

    if (!updatedCourses.length) {
      throw new Error('No course found')
    }

    // return response
    return NextResponse.json(
      {
        updatedCourses,
        message: `Course ${updatedCourses
          .map(course => `"${course.title}"`)
          .reverse()
          .join(', ')} ${updatedCourses.length > 1 ? 'have' : 'has'} been ${
          value ? 'activated' : 'deactivated'
        }`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
