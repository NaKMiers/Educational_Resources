import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import FlashSaleModel from '@/models/FlashSaleModel'
import CourseModel, { ICourse } from '@/models/CourseModel'
import TagModel from '@/models/TagModel'
// import { deleteFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Product, Category, Tag, Flashsale
import '@/models/CategoryModel'
import '@/models/FlashSaleModel'
import '@/models/CourseModel'
import '@/models/TagModel'

// [DELETE]: /admin/product/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Products - ')

  try {
    // // connect to database
    // await connectDatabase()

    // // get product ids to delete
    // const { ids } = await req.json()

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
    //       await FlashSaleModel.updateOne(
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

    return NextResponse.json({ message: 'Delete products' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
