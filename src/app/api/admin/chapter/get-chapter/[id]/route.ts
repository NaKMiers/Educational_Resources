import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Chapter, Course
import '@/models/ChapterModel'
import '@/models/CourseModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/chapter/get-chapter/:id
export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Get Chapter -')

  try {
    // connect to database
    await connectDatabase()

    // get chapter from database
    const chapter = await ChapterModel.findById(id).populate('courseId').lean()

    // return chapter
    return NextResponse.json({ chapter }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
