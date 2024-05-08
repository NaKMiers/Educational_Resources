import { connectDatabase } from '@/config/database'
import VoucherModel from '@/models/VoucherModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Voucher
import '@/models/VoucherModel'

// [PUT]: /api/admin/tag/:code/edit
export async function PUT(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Edit Voucher -')

  try {
    // connect to database
    await connectDatabase()

    // get data to edit
    const {
      code: newCode,
      desc,
      begin,
      expire,
      minTotal,
      maxReduce,
      type,
      value,
      timesLeft,
      owner,
      active,
    } = await req.json()

    // update voucher
    await VoucherModel.findOneAndUpdate(
      { code },
      {
        $set: {
          code: newCode,
          desc,
          begin,
          expire,
          minTotal,
          maxReduce,
          type,
          value,
          timesLeft,
          owner: owner || null,
          active,
        },
      }
    )

    return NextResponse.json({ message: 'Voucher has been updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
