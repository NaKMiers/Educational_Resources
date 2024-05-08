import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

// [GET]: /admin/category/force-all
export async function GET(req: NextRequest) {
  console.log('- Get Force All Categories -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    const filter: { [key: string]: any } = {}

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (key === 'exist-product') {
          // exist-product: true mean courseQuantity field must be > 0
          filter.courseQuantity = { $gt: 0 }
          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get all categories from database
    const categories = await CategoryModel.find(filter).sort({ createdAt: -1 }).lean()

    return NextResponse.json({ categories }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
