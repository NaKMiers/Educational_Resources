import { connectDatabase } from '@/config/database'
import FlashSaleModel from '@/models/FlashSaleModel'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Product, Flash Sale
import '@/models/FlashSaleModel'
import '@/models/CourseModel'

// [PUT]: /api/admin/flash-sale/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Flash sale -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create flash sale
    const { type, value, begin, timeType, duration, expire, appliedProducts } = await req.json()

    // update flashsale
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

    // get products that have been applied by the updated flash sale before
    const originalAppliedProducts = await CourseModel.find({ flashsale: updatedFlashSale._id }).select(
      '_id'
    )

    // get products that have been removed from the updated flash sale
    const removedProducts = originalAppliedProducts.filter(id => !appliedProducts.includes(id))
    const setProducts = appliedProducts.filter((id: string) => !originalAppliedProducts.includes(id))

    await CourseModel.updateMany({ _id: { $in: removedProducts } }, { $set: { flashsale: null } })
    await CourseModel.updateMany(
      { _id: { $in: setProducts } },
      { $set: { flashsale: updatedFlashSale._id } }
    )

    const productQuantity = await CourseModel.countDocuments({ flashsale: updatedFlashSale._id })

    // update flash sale quantity
    await FlashSaleModel.findByIdAndUpdate(updatedFlashSale._id, { $set: { productQuantity } })

    // return new flash sale
    return NextResponse.json(
      { message: `Flash sale (${updatedFlashSale.value}) has been updated` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
