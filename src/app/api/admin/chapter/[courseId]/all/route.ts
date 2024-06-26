import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Chapter, Course
import '@/models/ChapterModel'
import '@/models/CourseModel'
import CourseModel from '@/models/CourseModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/chapter/:courseId/all
export async function GET(req: NextRequest, { params: { courseId } }: { params: { courseId: string } }) {
  console.log('- Get All Chapters Of Course -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 9
    const filter: { [key: string]: any } = { courseId }
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

    // get course
    const course = await CourseModel.findById(courseId).select('title slug').lean()

    // check if course not found
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 })
    }

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (key === 'limit') {
          if (params[key][0] === 'no-limit') {
            itemPerPage = Number.MAX_SAFE_INTEGER
            skip = 0
          } else {
            itemPerPage = +params[key][0]
          }
          continue
        }

        // Special Cases ---------------------
        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['title', 'content']

          filter.$or = searchFields.map(field => ({
            [field]: { $regex: params[key][0], $options: 'i' },
          }))
          continue
        }

        if (key === 'sort') {
          sort = {
            [params[key][0].split('|')[0]]: +params[key][0].split('|')[1],
          }
          continue
        }

        if (['price', 'sold'].includes(key)) {
          filter[key] = { $lte: +params[key][0] }
          continue
        }
        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of course
    const amount = await ChapterModel.countDocuments(filter)

    // get all chapters from database
    const chapters = await ChapterModel.find(filter).sort(sort).skip(skip).limit(itemPerPage).lean()

    // return all courses
    return NextResponse.json({ course, chapters, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
