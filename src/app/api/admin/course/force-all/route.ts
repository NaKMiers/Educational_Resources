import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import { NextResponse } from 'next/server'

// Models: Product, Tag, Category
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/TagModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/product/force-all
export async function GET() {
  console.log('- Get Force All Products -')

  try {
    // connect to database
    await connectDatabase()

    // get all products from database
    const products = await CourseModel.find()
      .select('title images')
      .populate({
        path: 'tags',
        select: 'title',
      })
      .populate({
        path: 'category',
        select: 'title',
      })
      .sort({ sold: -1 })
      .lean()

    // return all products
    return NextResponse.json({ products }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
