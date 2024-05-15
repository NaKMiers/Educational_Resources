import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Chapter
import '@/models/ChapterModel'

// [POST]: /admin/chapter/:courseId/add
export async function POST(
  req: NextRequest,
  { params: { courseId } }: { params: { courseId: string } }
) {
  console.log('- Add Chapter -')

  try {
    // connect to database
    await connectDatabase()

    // get data field to add new chapter
    const { title, content, order } = await req.json()

    console.log('courseId:', courseId)
    console.log('title:', title)
    console.log('content:', content)
    console.log('order:', order)

    // create new chapter
    const newChapter = new ChapterModel({
      courseId,
      title,
      content,
      order,
    })

    // save new chapter to database
    await newChapter.save()

    // stay current page
    return NextResponse.json(
      { newChapter, message: `Chapter "${newChapter.title}" has been added` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
