import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

// [POST]: /admin/tag/add
export async function POST(req: NextRequest) {
  console.log('- Add Category -')

  try {
    // connect to database
    // await connectDatabase()

    // // get data to create product
    // const formData = await req.formData()
    // const data = Object.fromEntries(formData)
    // const { title, color } = data
    // let logo = formData.get('logo')

    // // check avatar
    // if (!logo) {
    //   return NextResponse.json({ message: 'Không có ảnh đại diện nào' }, { status: 400 })
    // }

    // // upload avatar and get imageUrl from AWS S3 Bucket
    // const imageUrl = await uploadFile(logo, '1:1')

    // // create new tag
    // const newCategory = new CategoryModel({
    //   title: (title as string).trim(),
    //   color: color,
    //   logo: imageUrl,
    // })

    // // save new tag to database
    // await newCategory.save()

    // // stay current page
    // return NextResponse.json(
    //   { message: `Category "${newCategory.title}" has been created` },
    //   { status: 201 }
    // )

    return NextResponse.json({ message: 'Chức năng đang phát triển' }, { status: 501 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
