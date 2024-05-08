import { EditingValues } from '@/app/(admin)/admin/category/all/page'
import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { generateSlug } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

// [PUT]: /admin/categories/edit
export async function PUT(req: NextRequest) {
  console.log('- Edit Categories -')

  try {
    // connect to database
    await connectDatabase()

    // get category values to edit
    const { editingValues } = await req.json()

    // create an array of promises for each update operation
    const updatePromises = editingValues.map((editValue: EditingValues) =>
      CategoryModel.findByIdAndUpdate(
        editValue._id,
        {
          $set: {
            title: editValue.title.trim(),
            slug: generateSlug(editValue.title.trim()),
          },
        },
        { new: true }
      )
    )

    // wait for all update operations to complete
    const editedCategories = await Promise.all(updatePromises)

    // return response
    return NextResponse.json({
      editedCategories,
      message: `Edited Categories: ${editedCategories.map(cate => cate.title).join(', ')}`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
