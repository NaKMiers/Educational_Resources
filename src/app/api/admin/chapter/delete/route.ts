import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Chapter
import '@/models/ChapterModel'

// [DELETE]: /admin/chapter/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Chapters - ')

  try {
    // connect to database
    await connectDatabase()

    // get chapter ids to delete
    const { ids } = await req.json()

    // get delete categories
    const deletedChapters = await ChapterModel.find({ _id: { $in: ids } }).lean()

    // delete chapter from database
    await ChapterModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json(
      {
        deletedChapters,
        message: `Chapter ${deletedChapters
          .map(chapter => `"${chapter.title}"`)
          .reverse()
          .join(', ')} ${deletedChapters.length > 1 ? 'have' : 'has'} been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
