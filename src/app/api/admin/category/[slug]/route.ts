import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

export const dynamic = 'force-dynamic'

// [GET]: admin/category/:slug
export async function GET(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Get Category -')

  try {
    // connect to database
    await connectDatabase()

    // get category from database
    const category = await CategoryModel.findOne({ slug }).lean()

    // check category
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 })
    }

    // return category
    return NextResponse.json({ category, message: 'Category found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
