import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

export const dynamic = 'force-dynamic'

// [GET]: /category
export async function GET(req: NextRequest) {
  console.log('- Get Categories -')

  try {
    // connect to database
    await connectDatabase()

    // get all categories from database
    const categories = await CategoryModel.find().lean()

    // return categories
    return NextResponse.json({ categories }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
