import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Product
import '@/models/CourseModel'

// [PATCH]: /admin/product/activate
export async function PATCH(req: NextRequest) {
  console.log('- Activate Products - ')

  try {
    // connect to database
    await connectDatabase()

    // get product id to delete
    const { ids, value } = await req.json()

    // update products from database
    await CourseModel.updateMany({ _id: { $in: ids } }, { $set: { active: value || false } })

    // get updated products
    const updatedProducts = await CourseModel.find({ _id: { $in: ids } }).lean()

    if (!updatedProducts.length) {
      throw new Error('No product found')
    }

    // return response
    return NextResponse.json(
      {
        updatedProducts,
        message: `Product ${updatedProducts
          .map(product => `"${product.title}"`)
          .reverse()
          .join(', ')} ${updatedProducts.length > 1 ? 'have' : 'has'} been ${
          value ? 'activated' : 'deactivated'
        }`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
