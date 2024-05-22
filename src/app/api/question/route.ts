import { connectDatabase } from '@/config/database'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Question
import CommentModel from '@/models/CommentModel'
import '@/models/QuestionModel'
import QuestionModel, { IQuestion } from '@/models/QuestionModel'

export const dynamic = 'force-dynamic'

// [GET]: /question?...
export async function GET(req: NextRequest) {
  console.log('- Get Questions -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    console.log('params', params)

    // options
    let skip = 0
    let itemPerPage = 8
    const filter: { [key: string]: any } = { status: 'open' }
    let sort: { [key: string]: any } = { updatedAt: -1 } // default sort

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        // Special Cases ---------------------
        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['content', 'slug']

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

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // amount
    const amount = await QuestionModel.countDocuments(filter)

    // get questions from database with filter
    let questions: IQuestion[] = await QuestionModel.find(filter)
      .populate('userId')
      .sort(sort)
      .skip(skip)
      .limit(itemPerPage)
      .lean()

    // i want to count the number of comment in each question
    questions = await Promise.all(
      questions.map(async question => {
        const commentAmount = await CommentModel.countDocuments({ questionId: question._id })
        return { ...question, commentAmount }
      })
    )

    // return response
    return NextResponse.json({ questions, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.nessage }, { status: 500 })
  }
}
