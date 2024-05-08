import { connectDatabase } from '@/config/database'
import UserModel, { IUser } from '@/models/UserModel'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'
import { searchParamsToObject } from '@/utils/handleQuery'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Voucher
import '@/models/UserModel'
import '@/models/VoucherModel'

export type UserWithVouchers = IUser & { vouchers: IVoucher[] }

// [GET]: /admin/summary/all
export async function GET(req: NextRequest) {
  console.log('- Get All Collaborators -')

  try {
    // connect to database
    await connectDatabase()

    // get query params
    const params: { [key: string]: string[] } = searchParamsToObject(req.nextUrl.searchParams)

    // options
    let skip = 0
    let itemPerPage = 9
    const filter: { [key: string]: any } = { role: { $in: ['collaborator', 'editor'] } }
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

        // Normal Cases ---------------------
        filter[key] = params[key].length === 1 ? params[key][0] : { $in: params[key] }
      }
    }

    // get amount of collaborators
    const amount = await UserModel.countDocuments(filter)

    // get all collaborators from database
    const collaborators = await UserModel.find(filter).sort(sort).skip(skip).limit(itemPerPage).lean()

    // get vouchers associated with each collaborator
    const collaboratorsWithVouchers: UserWithVouchers[] = await Promise.all(
      collaborators.map(async collaborator => {
        const vouchers: IVoucher[] = await VoucherModel.find({ owner: collaborator._id }).lean()
        return { ...collaborator, vouchers } as UserWithVouchers
      })
    )

    // return all collaborators
    return NextResponse.json({ collaborators: collaboratorsWithVouchers, amount }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
