import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import LessonModel from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Chapter, Lesson
import '@/models/ChapterModel'
import '@/models/LessonModel'

// [DELETE]: /admin/chapter/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Chapters - ')

  try {
    // connect to database
    await connectDatabase()

    // get chapter ids to delete
    const { ids } = await req.json()

    // only allow to delete chapter if no lessons are associated with them
    const lessonExists = await LessonModel.exists({ chapterId: { $in: ids } })
    if (lessonExists) {
      return NextResponse.json(
        { message: `Cannot delete chapters with lessons. Please delete all related lessons first` },
        { status: 400 }
      )
    }

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
