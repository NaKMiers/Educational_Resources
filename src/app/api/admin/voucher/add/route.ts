import { connectDatabase } from '@/config/database'
import VoucherModel from '@/models/VoucherModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Voucher
import '@/models/VoucherModel'

// [POST]: /admin/voucher/add
export async function POST(req: NextRequest) {
  console.log('- Add Voucher -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create voucher
    const { code, desc, begin, expire, minTotal, maxReduce, type, value, timesLeft, owner, active } =
      await req.json()

    // get voucher with code from database
    const voucher = await VoucherModel.findOne({ code }).lean()

    // return error if voucher has already existed
    if (voucher) {
      return NextResponse.json({ message: 'Voucher has already existed' }, { status: 400 })
    }

    // create new voucher
    const newVoucher = new VoucherModel({
      code,
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
    })

    // save new voucher to database
    await newVoucher.save()

    // return response
    return NextResponse.json(
      { newVoucher, message: `Voucher "${newVoucher.code}" has been created` },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
