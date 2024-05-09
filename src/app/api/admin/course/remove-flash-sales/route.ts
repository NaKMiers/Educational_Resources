import { connectDatabase } from '@/config/database'
import FlashSaleModel from '@/models/FlashSaleModel'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Flashsale
import '@/models/FlashSaleModel'
import '@/models/CourseModel'

// [PATCH]: /admin/course/activate
export async function PATCH(req: NextRequest) {
  console.log('- Activate Courses - ')

  try {
    // connect to database
    await connectDatabase()

    // get course ids to remove flash sales
    const { ids } = await req.json()

    // update courses from database
    await CourseModel.updateMany({ _id: { $in: ids } }, { $set: { flashSale: null } })

    // get updated courses
    const updatedCourses = await CourseModel.find({ _id: { $in: ids } }).lean()

    if (!updatedCourses.length) {
      throw new Error('No course found')
    }

    // update flash sale course quantity
    await FlashSaleModel.updateMany(
      { _id: { $in: updatedCourses.map(course => course.flashSale) } },
      { $inc: { courseQuantity: -1 } }
    )

    // return response
    return NextResponse.json(
      {
        updatedCourses,
        message: `Flash sale of course ${updatedCourses
          .map(course => `"${course.title}"`)
          .reverse()
          .join(', ')} ${updatedCourses.length > 1 ? 'have' : 'has'} been removed`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
