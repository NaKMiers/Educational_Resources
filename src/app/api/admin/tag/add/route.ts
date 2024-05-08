import { connectDatabase } from '@/config/database'
import TagModel, { ITag } from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tag
import '@/models/TagModel'

// [POST]: /admin/tag/add
export async function POST(req: NextRequest) {
  console.log('- Add Tag -')

  try {
    // connect to database
    await connectDatabase()

    // get data field to add new tag
    const { title, booted } = await req.json()

    // create new tag
    const newTag = new TagModel({
      title: title.trim(),
      booted: !!booted,
    } as ITag)

    // save new tag to database
    await newTag.save()

    // stay current page
    return NextResponse.json({ message: `Tag "${newTag.title}" has been created` }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
