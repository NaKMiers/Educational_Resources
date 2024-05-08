import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

// Models: Product, Tag, Category
import '@/models/CategoryModel'
import '@/models/ProductModel'
import '@/models/TagModel'

// [POST]: /admin/product/add
export async function POST(req: NextRequest) {
  console.log('- Add Product -')

  try {
    // // connect to database
    // await connectDatabase()

    // // get data to create product
    // const formData = await req.formData()
    // const data = Object.fromEntries(formData)
    // const { title, price, oldPrice, description, isActive, category } = data
    // const tags = JSON.parse(data.tags as string)
    // let images = formData.getAll('images')

    // // check images
    // if (!images.length) {
    //   return NextResponse.json({ message: 'Images are required' }, { status: 400 })
    // }

    // if (!Array.isArray(images)) {
    //   images = [images]
    // }

    // const imageUrls = await Promise.all(images.map(file => uploadFile(file)))

    // // create new product
    // const newProduct = new ProductModel({
    //   title,
    //   price,
    //   description,
    //   active: isActive,
    //   tags,
    //   category,
    //   oldPrice,
    //   images: imageUrls,
    // })

    // // save new product to database
    // await newProduct.save()

    // // increase related category and tags product quantity
    // await TagModel.updateMany({ _id: { $in: tags } }, { $inc: { productQuantity: 1 } })
    // await CategoryModel.findByIdAndUpdate(category, {
    //   $inc: { productQuantity: 1 },
    // })

    // // Disconnect from MongoDB in case of error
    // await mongoose.disconnect()

    // // return new product
    // return NextResponse.json(
    //   { product: newProduct, message: `Product "${newProduct.title}" has been created` },
    //   { status: 201 }
    // )

    return NextResponse.json('')
  } catch (err: any) {
    // Disconnect from MongoDB in case of error
    await mongoose.disconnect()

    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
