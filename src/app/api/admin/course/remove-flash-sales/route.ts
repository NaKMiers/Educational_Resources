import { connectDatabase } from '@/config/database'
import FlashSaleModel from '@/models/FlashSaleModel'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Product, Flashsale
import '@/models/FlashSaleModel'
import '@/models/CourseModel'

// [PATCH]: /admin/product/activate
export async function PATCH(req: NextRequest) {
  console.log('- Activate Products - ')

  try {
    // connect to database
    await connectDatabase()

    // get product ids to remove flash sales
    const { ids } = await req.json()

    // update products from database
    await CourseModel.updateMany({ _id: { $in: ids } }, { $set: { flashsale: null } })

    // get updated products
    const updatedProducts = await CourseModel.find({ _id: { $in: ids } }).lean()

    if (!updatedProducts.length) {
      throw new Error('No product found')
    }

    // update flash sale product quantity
    await FlashSaleModel.updateMany(
      { _id: { $in: updatedProducts.map(product => product.flashsale) } },
      { $inc: { productQuantity: -1 } }
    )

    // return response
    return NextResponse.json(
      {
        updatedProducts,
        message: `Flash sale of product ${updatedProducts
          .map(product => `"${product.title}"`)
          .reverse()
          .join(', ')} ${updatedProducts.length > 1 ? 'have' : 'has'} been removed`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
