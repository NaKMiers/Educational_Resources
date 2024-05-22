import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Category, Tag
import { connectDatabase } from '@/config/database'
import '@/models/CategoryModel'
import CategoryModel from '@/models/CategoryModel'
import '@/models/CourseModel'
import CourseModel, { ICourse } from '@/models/CourseModel'
import '@/models/TagModel'
import TagModel from '@/models/TagModel'
import { generateSlug } from '@/utils'
import { deleteFile, uploadFile } from '@/utils/uploadFile'

// [PUT]: /api/admin/tag/:code/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Course -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create course
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { title, price, oldPrice, author, description, isActive } = data
    const tags = JSON.parse(data.tags as string)
    const categories = JSON.parse(data.categories as string)
    const originalImages = JSON.parse(data.originalImages as string)
    let images = formData.getAll('images')

    // get course from database to edit
    const course: ICourse | null = await CourseModel.findById(id).lean()

    // course does exist
    if (!course) {
      return NextResponse.json({ message: 'Course does not exist' }, { status: 404 })
    }

    // upload images to aws s3
    const imageUrls: string[] = await Promise.all(images.map(file => uploadFile(file)))

    const stayImages = course.images.filter(img => originalImages.includes(img))
    const needToRemovedImages = course.images.filter(img => !originalImages.includes(img))

    // delete the images do not associated with the course in aws s3
    if (needToRemovedImages && !!needToRemovedImages.length) {
      await Promise.all(needToRemovedImages.map(image => deleteFile(image)))
    }

    // merge the available images and new upload images
    const newImages = Array.from(new Set([...stayImages, ...imageUrls]))

    // update course in database
    await CourseModel.findByIdAndUpdate(id, {
      $set: {
        title: title,
        price,
        oldPrice: oldPrice === 'null' ? null : oldPrice,
        author,
        description,
        active: isActive,
        tags,
        categories,
        images: newImages,
        slug: generateSlug(title as string),
      },
    })

    // get tags that need to be increased and decreased
    const oldTags: string[] = course.tags as string[]
    const newTags: string[] = tags as string[]

    const tagsToIncrease = newTags.filter((tag: string) => !oldTags.includes(tag))
    const tagsToDecrease = oldTags.filter((tag: string) => !newTags.includes(tag))

    // get categories that need to be increased and decreased
    const oldCategories: string[] = course.categories as string[]
    const newCategories: string[] = categories as string[]

    const categoriesToIncrease = newCategories.filter((tag: string) => !oldCategories.includes(tag))
    const categoriesToDecrease = oldCategories.filter((tag: string) => !newCategories.includes(tag))

    // increase related category and tags course quantity
    await Promise.all([
      TagModel.updateMany({ _id: { $in: tagsToIncrease } }, { $inc: { courseQuantity: 1 } }),
      TagModel.updateMany({ _id: { $in: tagsToDecrease } }, { $inc: { courseQuantity: -1 } }),
      CategoryModel.updateMany({ _id: { $in: categoriesToIncrease } }, { $inc: { courseQuantity: 1 } }),
      CategoryModel.updateMany({ _id: { $in: categoriesToDecrease } }, { $inc: { courseQuantity: -1 } }),
    ])

    // return response
    return NextResponse.json({ message: `Course ${course.title} has been updated` }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
