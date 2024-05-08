import { connectDatabase } from '@/config/database'
import '@/models/UserModel'
import VoucherModel from '@/models/VoucherModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Voucher, User
import '@/models/UserModel'
import '@/models/VoucherModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/voucher/:id
export async function GET(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Get Voucher -')

  try {
    // connect to database
    await connectDatabase()

    // get voucher from database
    const voucher = await VoucherModel.findOne({ code }).populate('owner').lean()

    // check voucher
    if (!voucher) {
      return NextResponse.json({ message: 'Voucher not found' }, { status: 404 })
    }

    // return voucher
    return NextResponse.json({ voucher, message: 'Voucher found' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
