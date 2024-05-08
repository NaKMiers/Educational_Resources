import { NextRequest, NextResponse } from 'next/server'

// Models: Product, Category, Tag
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/TagModel'

// [PUT]: /api/admin/tag/:code/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Product -')

  try {
    // // connect to database
    // await connectDatabase()

    // // get data to create product
    // const formData = await req.formData()
    // const data = Object.fromEntries(formData)
    // const { title, price, oldPrice, description, isActive, category } = data
    // const tags = JSON.parse(data.tags as string)
    // const originalImages = JSON.parse(data.originalImages as string)
    // let images = formData.getAll('images')

    // // get product from database to edit
    // const product: IProduct | null = await CourseModel.findById(id).lean()

    // // product does exist
    // if (!product) {
    //   return NextResponse.json({ message: 'Product does not exist' }, { status: 404 })
    // }

    // // upload images to aws s3
    // const imageUrls = await Promise.all(images.map(file => uploadFile(file)))

    // const stayImages = product.images.filter(img => originalImages.includes(img))
    // const needToRemovedImages = product.images.filter(img => !originalImages.includes(img))

    // // delete the images do not associated with the product in aws s3
    // if (needToRemovedImages && !!needToRemovedImages.length) {
    //   await Promise.all(needToRemovedImages.map(deleteFile))
    // }

    // // merge the available images and new upload images
    // const newImages = Array.from(new Set([...stayImages, ...imageUrls]))

    // // update product in database
    // await CourseModel.findByIdAndUpdate(id, {
    //   $set: {
    //     title: title,
    //     price,
    //     oldPrice: oldPrice === 'null' ? null : oldPrice,
    //     description,
    //     active: isActive,
    //     tags,
    //     category,
    //     images: newImages,
    //     slug: generateSlug(title as string),
    //   },
    // })

    // // get tags that need to be increased and decreased
    // const oldTags = product.tags
    // const newTags = tags

    // const tagsToIncrease = newTags.filter((tag: string) => !oldTags.includes(tag))
    // const tagsToDecrease = oldTags.filter((tag: string) => !newTags.includes(tag))

    // // get category that need to be increased and decreased
    // const oldCategory = product.category
    // const newCategory = category

    // // increase related category and tags product quantity
    // await Promise.all([
    //   TagModel.updateMany({ _id: { $in: tagsToIncrease } }, { $inc: { productQuantity: 1 } }),
    //   TagModel.updateMany({ _id: { $in: tagsToDecrease } }, { $inc: { productQuantity: -1 } }),
    //   CategoryModel.findByIdAndUpdate(newCategory, { $inc: { productQuantity: 1 } }),
    //   CategoryModel.findByIdAndUpdate(oldCategory, { $inc: { productQuantity: -1 } }),
    // ])

    // // return response
    // return NextResponse.json({ message: `Product ${product.title} has been updated` }, { status: 200 })

    return NextResponse.json('Edit Product')
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
