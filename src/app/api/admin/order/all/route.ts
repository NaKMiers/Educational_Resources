import { connectDatabase } from '@/config/database'
import OrderModel from '@/models/OrderModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import momentTZ from 'moment-timezone'
import { NextRequest, NextResponse } from 'next/server'

// Models: Order, Voucher,
import '@/models/OrderModel'
import '@/models/VoucherModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/order/all
export async function GET(req: NextRequest) {
  console.log('- Get All Orders -')

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

    console.log('Params: ', params)

    // build filter
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        // Special Cases ---------------------
        if (key === 'limit') {
          if (params[key][0] === 'no-limit') {
            itemPerPage = Number.MAX_SAFE_INTEGER
            skip = 0
          } else {
            itemPerPage = +params[key][0]
          }
          continue
        }

        if (key === 'page') {
          const page = +params[key][0]
          skip = (page - 1) * itemPerPage
          continue
        }

        if (key === 'search') {
          const searchFields = ['code', 'email', 'status', 'paymentMethod']

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

        if (key === 'total') {
          filter[key] = { $lte: +params[key][0] }
          continue
        }

        if (['userId', 'voucherApplied'].includes(key)) {
          filter[key] =
            params[key][0] === 'true' ? { $exists: true, $ne: null } : { $exists: false, $eq: null }
          continue
        }

        if (key === 'from-to') {
          const dates = params[key][0].split('|')

          if (dates[0] && dates[1]) {
            filter.createdAt = {
              $gte: momentTZ.tz(dates[0], 'Asia/Ho_Chi_Minh').toDate(),
              $lt: momentTZ.tz(dates[1], 'Asia/Ho_Chi_Minh').toDate(),
            }
          } else if (dates[0]) {
            filter.createdAt = {
              $gte: momentTZ.tz(dates[0], 'Asia/Ho_Chi_Minh').toDate(),
            }
          } else if (dates[1]) {
            filter.createdAt = {
              $lt: momentTZ.tz(dates[1], 'Asia/Ho_Chi_Minh').toDate(),
            }
          }

          continue
        }

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of account
    const amount = await OrderModel.countDocuments(filter)

    // get all order from database
    const orders = await OrderModel.find(filter)
      .populate({
        path: 'voucherApplied',
        select: 'code desc',
      })
      .sort(sort)
      .skip(skip)
      .limit(itemPerPage)
      .lean()

    // get all order without filter
    const chops = await OrderModel.aggregate([
      {
        $group: {
          _id: null,
          minTotal: { $min: '$total' },
          maxTotal: { $max: '$total' },
        },
      },
    ])

    // retunr all orders
    return NextResponse.json({ orders, amount, chops: chops[0] }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
