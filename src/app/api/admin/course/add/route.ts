import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import CourseModel from '@/models/CourseModel'
import TagModel from '@/models/TagModel'
import { uploadFile } from '@/utils/uploadFile'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Tag, Category
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/TagModel'

// [POST]: /admin/course/add
export async function POST(req: NextRequest) {
  console.log('- Add Course -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create course
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { title, price, oldPrice, description, active } = data
    const tags = JSON.parse(data.tags as string)
    const categories = JSON.parse(data.categories as string)
    let images = formData.getAll('images')

    // check images
    if (!images.length) {
      return NextResponse.json({ message: 'Images are required' }, { status: 400 })
    }

    if (!Array.isArray(images)) {
      images = [images]
    }

    const imageUrls = await Promise.all(images.map(file => uploadFile(file)))
    console.log('imageUrls:', imageUrls)

    // create new course
    const newCourse = new CourseModel({
      title,
      price,
      description,
      active,
      tags,
      categories,
      oldPrice,
      images: imageUrls,
    })

    // save new course to database
    await newCourse.save()

    // increase related category and tags course quantity
    await TagModel.updateMany({ _id: { $in: tags } }, { $inc: { courseQuantity: 1 } })
    await CategoryModel.updateMany({ _id: { $in: categories } }, { $inc: { courseQuantity: 1 } })

    // return new course
    return NextResponse.json(
      { course: newCourse, message: `Course "${newCourse.title}" has been created` },
      { status: 201 }
    )

    // rceturn NextResponse.json({ message: 'Course has been created' }, { status: 201 })
  } catch (err: any) {
    // Disconnect from MongoDB in case of error
    await mongoose.disconnect()

    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
