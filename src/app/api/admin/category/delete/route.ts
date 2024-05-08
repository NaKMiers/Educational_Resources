import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'
// import { deleteFile } from '@/utils/uploadFile'

// [DELETE]: /admin/category/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Categories - ')

  try {
    // // connect to database
    // await connectDatabase()
    // // get category ids to delete
    // const { ids } = await req.json()
    // // get delete categories
    // const deletedCategories = await CategoryModel.find({ _id: { $in: ids } }).lean()
    // // delete the images associated with each category
    // await Promise.all(
    //   deletedCategories
    //     .map(category => category.logo)
    //     .filter(logo => logo)
    //     .map(deleteFile)
    // )
    // // delete category from database
    // await CategoryModel.deleteMany({ _id: { $in: ids } })
    // // return response
    // return NextResponse.json(
    //   {
    //     deletedCategories,
    //     message: `Category ${deletedCategories
    //       .map(cate => `"${cate.title}"`)
    //       .reverse()
    //       .join(', ')} ${deletedCategories.length > 1 ? 'have' : 'has'} been deleted`,
    //   },
    //   { status: 200 }
    // )

    return NextResponse.json({ message: 'Delete Categories' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
