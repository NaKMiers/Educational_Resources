import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

// [PATCH]: /admin/category/boot
export async function PATCH(req: NextRequest) {
  console.log('- Boot Categories - ')

  try {
    // connect to database
    await connectDatabase()

    // get category id to delete
    const { ids, value } = await req.json()

    // update categories from database
    await CategoryModel.updateMany({ _id: { $in: ids } }, { $set: { boot: value || false } })

    // get updated categories
    const updatedCategories = await CategoryModel.find({ _id: { $in: ids } }).lean()

    if (!updatedCategories.length) {
      throw new Error('No category found')
    }

    // return response
    return NextResponse.json(
      {
        updatedCategories,
        message: `Category ${updatedCategories
          .map(category => `"${category.title}"`)
          .reverse()
          .join(', ')} ${updatedCategories.length > 1 ? 'have' : 'has'} been featured`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
