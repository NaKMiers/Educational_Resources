import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/category/all
export async function GET(req: NextRequest) {
  console.log('- Get All Categories -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 10
    const filter: { [key: string]: any } = {}
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

        if (key === 'sort') {
          sort = {
            [params[key][0].split('|')[0]]: +params[key][0].split('|')[1],
          }
          continue
        }

        if (key === 'courseQuantity') {
          filter[key] = { $lte: +params[key][0] }
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of lesson
    const amount = await CategoryModel.countDocuments(filter)

    // get all categories from database
    const categories = await CategoryModel.find(filter).sort(sort).skip(skip).limit(itemPerPage).lean()

    // get all order without filter
    const chops = await CategoryModel.aggregate([
      {
        $group: {
          _id: null,
          mincourseQuantity: { $min: '$courseQuantity' },
          maxcourseQuantity: { $max: '$courseQuantity' },
        },
      },
    ])

    return NextResponse.json({ categories, amount, chops: chops[0] }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
