import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { deleteFile, uploadFile } from '@/utils/uploadFile'

cloudinary.config({
  cloud_name: 'djpg3r44p',
  api_key: '797263659321177',
  api_secret: 'J6NNbfhmKYHkoYcWlR3uAhXNdEE',
  secure: true,
})

export async function POST(req: NextRequest) {
  console.log('Admin')

  try {
    // get data to create product
    const formData = await req.formData()
    let image = formData.get('image')

    console.log('image', image)

    if (!image) {
      return NextResponse.json({ error: 'No image found' }, { status: 400 })
    }

    const url = await uploadFile(image)
    console.log('url', url)

    // const res = await deleteFile('gzwvgcqtaz9uw5f78psf')
    // console.log('res', res)

    return new Response('Hello from admin route', { status: 200 })
  } catch (err: any) {
    return new Response(err.message, { status: 500 })
  }
}
