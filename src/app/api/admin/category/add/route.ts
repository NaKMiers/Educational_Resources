import { connectDatabase } from '@/config/database'
import CategoryModel, { ICategory } from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

// [POST]: /admin/category/add
export async function POST(req: NextRequest) {
  console.log('- Add Category -')

  try {
    // connect to database
    await connectDatabase()

    // get data field to add new category
    const { title, booted } = await req.json()

    // create new category
    const newCategory = new CategoryModel({
      title: title.trim(),
      booted: !!booted,
    } as ICategory)

    // save new category to database
    await newCategory.save()

    // stay current page
    return NextResponse.json(
      { message: `Category "${newCategory.title}" has been created` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
