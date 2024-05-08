import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'
// import { deleteFile, uploadFile } from '@/utils/uploadFile'

// [PUT]: /admin/category/:slug/edit
export async function PUT(req: NextRequest, { params: { slug } }: { params: { slug: string } }) {
  console.log('- Edit Category -')

  try {
    // // connect to database
    // await connectDatabase()

    // // get data to create product
    // const formData = await req.formData()
    // const data = Object.fromEntries(formData)
    // const { title, color } = data
    // let logo = formData.get('logo')

    // // get category to check
    // const category: ICategory | null = await CategoryModel.findOne({ slug }).lean()

    // // if category does not exist
    // if (!category) {
    //   return NextResponse.json({ message: 'Category not found' }, { status: 404 })
    // }

    // let newLogo = category.logo
    // // check avatar
    // if (logo) {
    //   // upload avatar and get imageUrl from AWS S3 Bucket
    //   newLogo = await uploadFile(logo, '1:1')

    //   // delete old logo
    //   if (category.logo) {
    //     await deleteFile(category.logo)
    //   }
    // }

    // // update category
    // await CategoryModel.findOneAndUpdate(
    //   { slug },
    //   {
    //     $set: {
    //       title: (title as string).trim(),
    //       color,
    //       logo: newLogo,
    //       slug: generateSlug(title as string),
    //     },
    //   }
    // )

    // stay current page
    return NextResponse.json({ message: `Category has been updated` }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
