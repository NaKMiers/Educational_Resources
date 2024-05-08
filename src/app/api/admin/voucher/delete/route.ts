import { connectDatabase } from '@/config/database'
import VoucherModel from '@/models/VoucherModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Voucher
import '@/models/VoucherModel'

// [DELETE]: /admin/voucher/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Voucheres - ')

  try {
    // connect to database
    await connectDatabase()

    // get voucher ids to delete
    const { ids } = await req.json()

    // get delete vouchers
    const deletedVouchers = await VoucherModel.find({ _id: { $in: ids } }).lean()

    // delete voucher from database
    await VoucherModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json(
      {
        deletedVouchers,
        message: `Voucher ${deletedVouchers
          .map(voucher => `"${voucher.code}"`)
          .reverse()
          .join(', ')} ${deletedVouchers.length > 1 ? 'have' : 'has'} been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
