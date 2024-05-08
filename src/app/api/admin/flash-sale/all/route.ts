import { connectDatabase } from '@/config/database'
import FlashSaleModel from '@/models/FlashSaleModel'
import CourseModel from '@/models/CourseModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Product, Flash Sale
import '@/models/FlashSaleModel'
import '@/models/CourseModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/flash-sale/all
export async function GET(req: NextRequest) {
  console.log(' - Get All Flash Sales -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 9
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

        if (['begin', 'expire'].includes(key)) {
          const dates = params[key][0].split('|')

          if (dates[0] && dates[1]) {
            filter[key] = {
              $gte: new Date(dates[0]),
              $lt: new Date(dates[1]),
            }
          } else if (dates[0]) {
            filter[key] = {
              $gte: new Date(dates[0]),
            }
          } else if (dates[1]) {
            filter[key] = {
              $lt: new Date(dates[1]),
            }
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of account
    const amount = await FlashSaleModel.countDocuments(filter)

    // Get all flash sales from database
    const flashSales = await FlashSaleModel.find(filter).sort(sort).skip(skip).limit(itemPerPage).lean()

    // get products associated with each flash sale
    const flashSalesWithProducts = await Promise.all(
      flashSales.map(async flashSale => {
        const products = await CourseModel.find({ flashsale: flashSale._id })
          .select('title images')
          .lean()
        return { ...flashSale, products }
      })
    )

    // Return response
    return NextResponse.json({ flashSales: flashSalesWithProducts, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
