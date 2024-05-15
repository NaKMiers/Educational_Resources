import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Chapter
import '@/models/ChapterModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/chapter/[courseId]/all
export async function GET(req: NextRequest, { params: { courseId } }: { params: { courseId: string } }) {
  console.log('- Get Force All Chapters Of Course -')

  try {
    // connect to database
    await connectDatabase()

    // get all chapters from database
    const chapters = await ChapterModel.find({ courseId }).lean()

    // return all courses
    return NextResponse.json({ chapters }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
