import { connectDatabase } from '@/config/database'
import TagModel from '@/models/TagModel'
import { NextResponse } from 'next/server'

// Models: Tag
import '@/models/TagModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/tag/force-all
export async function GET() {
  console.log('- Get Force All Tags -')

  try {
    // connect to database
    await connectDatabase()

    // get all tags from database
    const tags = await TagModel.find().select('title').sort({ createdAt: -1 }).lean()

    return NextResponse.json({ tags }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
