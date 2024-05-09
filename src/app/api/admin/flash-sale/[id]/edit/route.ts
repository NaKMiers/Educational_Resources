import { connectDatabase } from '@/config/database'
import FlashSaleModel from '@/models/FlashSaleModel'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Flash Sale
import '@/models/FlashSaleModel'
import '@/models/CourseModel'

// [PUT]: /api/admin/flash-sale/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Flash sale -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create flash sale
    const { type, value, begin, timeType, duration, expire, appliedCourses } = await req.json()

    // update flashSale
    const updatedFlashSale = await FlashSaleModel.findByIdAndUpdate(id, {
      $set: {
        type,
        value,
        begin,
        timeType,
        duration: timeType === 'loop' ? duration : null,
        expire: timeType === 'once' ? expire : null,
      },
    })

    // get courses that have been applied by the updated flash sale before
    const originalAppliedCourses = await CourseModel.find({ flashSale: updatedFlashSale._id }).select(
      '_id'
    )

    // get courses that have been removed from the updated flash sale
    const removedCourses = originalAppliedCourses.filter(id => !appliedCourses.includes(id))
    const setCourses = appliedCourses.filter((id: string) => !originalAppliedCourses.includes(id))

    await CourseModel.updateMany({ _id: { $in: removedCourses } }, { $set: { flashSale: null } })
    await CourseModel.updateMany(
      { _id: { $in: setCourses } },
      { $set: { flashSale: updatedFlashSale._id } }
    )

    const courseQuantity = await CourseModel.countDocuments({ flashSale: updatedFlashSale._id })

    // update flash sale quantity
    await FlashSaleModel.findByIdAndUpdate(updatedFlashSale._id, { $set: { courseQuantity } })

    // return new flash sale
    return NextResponse.json(
      { message: `Flash sale (${updatedFlashSale.value}) has been updated` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
