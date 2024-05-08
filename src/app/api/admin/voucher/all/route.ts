import { connectDatabase } from '@/config/database'
import '@/models/UserModel'
import VoucherModel from '@/models/VoucherModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: Voucher, User
import '@/models/UserModel'
import '@/models/VoucherModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/voucher/all
export async function GET(req: NextRequest) {
  console.log('- Get All Vouchers -')

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

        if (key === 'search') {
          const searchFields = ['code', 'desc', 'type', 'value', 'usedUsers']

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

        if (['minTotal', 'maxReduce'].includes(key)) {
          filter[key] = { $lte: +params[key][0] }
          continue
        }

        if (key === 'timesLeft') {
          filter[key] = params[key][0] === 'true' ? { $gt: 0 } : { $lte: 0 }
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
    const amount = await VoucherModel.countDocuments(filter)

    // get all vouchers from database
    const vouchers = await VoucherModel.find(filter)
      .populate('owner', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(itemPerPage)
      .lean()

    // get all order without filter
    const chops = await VoucherModel.aggregate([
      {
        $group: {
          _id: null,
          minMinTotal: { $min: '$minTotal' },
          maxMinTotal: { $max: '$minTotal' },
          minMaxReduce: { $min: '$maxReduce' },
          maxMaxReduce: { $max: '$maxReduce' },
        },
      },
    ])

    // return vouchers
    return NextResponse.json({ vouchers, amount, chops: chops[0] }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
