import { connectDatabase } from '@/config/database'
import CourseModel, { ICourse } from '@/models/CourseModel'
import FlashSaleModel, { IFlashSale } from '@/models/FlashSaleModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Flash Sale
import '@/models/CourseModel'
import '@/models/FlashSaleModel'

export const dynamic = 'force-dynamic'

// [GET]: /flash-sale/:id
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  console.log('- Get Flash Sale -')

  try {
    // connect to database
    await connectDatabase()

    // get flash sale from database
    const flashSale: IFlashSale | null = await FlashSaleModel.findById(id).lean<IFlashSale>()

    if (!flashSale) {
      return NextResponse.json({ message: 'Flash sale not found' }, { status: 404 })
    }

    // get all course that have been applied by the flash sale
    const appliedCourses: ICourse[] = await CourseModel.find({ flashSale: flashSale._id }).select(
      'title images'
    )
    flashSale.courses = appliedCourses

    // return flash sale
    return NextResponse.json({ flashSale, message: 'Flashsale found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
