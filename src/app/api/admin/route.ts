import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { deleteFile, uploadFile } from '@/utils/uploadFile'

export async function POST(req: NextRequest) {
  console.log('Admin')

  try {
    // // get data to create course
    // const formData = await req.formData()
    // let image = formData.get('image')

    // console.log('image', image)

    // if (!image) {
    //   return NextResponse.json({ error: 'No image found' }, { status: 400 })
    // }

    // const url = await uploadFile(image)
    // console.log('url', url)

    const res = await deleteFile(
      'http://res.cloudinary.com/djpg3r44p/video/upload/v1715275254/krkrbwvfaxdanl1ubbqn.mp4',
      'video'
    )
    console.log('res', res)

    return new Response('Hello from admin route', { status: 200 })
  } catch (err: any) {
    return new Response(err.message, { status: 500 })
  }
}
