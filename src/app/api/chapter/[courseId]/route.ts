import { connectDatabase } from '@/config/database'
import ChapterModel, { IChapter } from '@/models/ChapterModel'
import LessonModel, { ILesson } from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Chapter, Lesson
import '@/models/ChapterModel'
import '@/models/CourseModel'
import '@/models/LessonModel'

export const dynamic = 'force-dynamic'

// [GET]: /course/learning/:courseId
export async function GET(req: NextRequest, { params: { courseId } }: { params: { courseId: string } }) {
  console.log('- Get Course Learning - ')

  try {
    // connect to database
    await connectDatabase()

    // get all chapters and lessons of course
    const chapters: IChapter[] = await ChapterModel.find({ courseId }).lean()
    const lessons: ILesson[] = await LessonModel.find({ courseId }).lean()

    // add lessons to each chapter
    const chaptersWithLessons = chapters.map(chapter => {
      const chapterLessons = lessons.filter(
        lesson => lesson.chapterId.toString() === chapter._id.toString()
      )
      return { ...chapter, lessons: chapterLessons }
    })

    // return course
    return NextResponse.json({ chapters: chaptersWithLessons }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
