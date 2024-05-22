import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { deleteFile, uploadFile } from '@/utils/uploadFile'

export async function POST(req: NextRequest) {
  console.log('Admin')

  try {
    return new Response('Hello from admin route', { status: 200 })
  } catch (err: any) {
    return new Response(err.message, { status: 500 })
  }
}
