import { connectDatabase } from '@/config/database'
import CourseModel from '@/models/CourseModel'
import LessonModel from '@/models/LessonModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Course, Category
import '@/models/CategoryModel'
import '@/models/ChapterModel'
import '@/models/CourseModel'
import '@/models/LessonModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/lesson/all
export async function GET(req: NextRequest) {
  console.log('- Get All Lessons - ')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 9
    const filter: { [key: string]: any } = { active: true }
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        // Special Cases ---------------------
        if (key === 'limit') {
          itemPerPage = +params[key][0]
          continue
        }

        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['title', 'description', 'sourceType', 'source']

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

        if (key === 'active') {
          if (params[key][0] === 'all') delete filter[key]
          else if (params[key][0] === 'true') filter[key] = true
          else if (params[key][0] === 'false') filter[key] = false
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of lesson
    const amount = await LessonModel.countDocuments(filter)

    // get all lesson
    const lessons = await LessonModel.find(filter)
      .populate({
        path: 'courseId',
        select: 'title images categories slug',
        populate: {
          path: 'categories',
          select: 'title',
        },
      })
      .populate({
        path: 'chapterId',
        select: 'title',
      })
      .sort(sort)
      .skip(skip)
      .limit(itemPerPage)
      .lean()

    // get all courses
    const courses = await CourseModel.find()
      .select('title categories')
      .populate({
        path: 'categories',
        select: 'title',
      })
      .sort({ sold: -1 })
      .lean()

    // return response
    return NextResponse.json({ lessons, amount, courses }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
