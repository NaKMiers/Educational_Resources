import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import { generateSlug } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'

// Models: Chapter
import '@/models/ChapterModel'

// [PUT]: /api/admin/chapter/edit
export async function PUT(req: NextRequest) {
  console.log('- Edit Chapter -')

  try {
    // connect to database
    await connectDatabase()

    // get chapter values to edit
    const { id, title, content, order } = await req.json()

    const updatedChapter = await ChapterModel.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          slug: generateSlug(title),
          content,
          order,
        },
      },
      { new: true }
    )

    return NextResponse.json({
      updatedChapter,
      message: `Edited Chapter: ${updatedChapter.title} has been updated`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
