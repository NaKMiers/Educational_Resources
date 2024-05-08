import { connectDatabase } from '@/config/database'
import { NextRequest, NextResponse } from 'next/server'

// Models: Product, Category, Tag, Flashsale, Account
import '@/models/AccountModel'
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/FlashSaleModel'
import '@/models/TagModel'

// [DELETE]: /admin/product/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Products - ')

  // connect to database
  await connectDatabase()

  // get product ids to delete
  const { ids } = await req.json()

  try {
    // // Find products by their IDs before deletion
    // const products: ICourse[] = await CourseModel.find({
    //   _id: { $in: ids },
    // }).lean()

    // // delete product by ids
    // await CourseModel.deleteMany({
    //   _id: { $in: ids },
    // })

    // // decrease product quantity filed in related categories, tags, and flashsales, and delete the images associated with each product
    // await Promise.all(
    //   products.map(async product => {
    //     // decrease related categories product quantity
    //     await CategoryModel.updateOne(
    //       { _id: product.category },
    //       {
    //         $inc: {
    //           productQuantity: -1,
    //         },
    //       }
    //     )

    //     // decrease related tags product quantity
    //     await TagModel.updateMany(
    //       { _id: { $in: product.tags } },
    //       {
    //         $inc: {
    //           productQuantity: -1,
    //         },
    //       }
    //     )

    //     // decrease related flashsales product quantity
    //     if (product.flashsale) {
    //       await FlashsaleModel.updateOne(
    //         { _id: product.flashsale },
    //         {
    //           $inc: {
    //             productQuantity: -1,
    //           },
    //         }
    //       )
    //     }

    //     // delete the images associated with each product
    //     await Promise.all(product.images.map(deleteFile))

    //     // delete all accounts which associalted with each product and has empty using user
    //     await AccountModel.deleteMany({
    //       type: product._id,
    //       usingUser: { $exists: false },
    //     })
    //   })
    // )

    // // return deleted products
    // return NextResponse.json(
    //   {
    //     deletedProducts: products,
    //     message: `${products.map(product => product.title).join(', ')} ${
    //       products.length > 1 ? 'have' : 'has'
    //     } been deleted`,
    //   },
    //   { status: 200 }
    // )

    return NextResponse.json('Delete Product')
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
