import { connectDatabase } from '@/config/database'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'
import { formatPrice } from '@/utils/number'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Voucher, User
import '@/models/VoucherModel'
import '@/models/UserModel'
import { IUser } from '@/models/UserModel'

// [POST]: /voucher/:code/apply
export async function POST(req: NextRequest, { params: { code } }: { params: { code: string } }) {
  console.log('- Apply Voucher -')

  try {
    // connect to database
    await connectDatabase()

    // get userId to check if user used this voucher
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userEmail = token?.email

    // get data to check voucher
    const { email, total } = await req.json()

    // get voucher from database to apply
    const voucher: IVoucher | null = await VoucherModel.findOne({ code, active: true })
      .populate('owner')
      .lean()

    // if voucher does not exist
    if (!voucher) {
      return NextResponse.json({ message: 'Voucher not found' }, { status: 404 })
    }

    // prevent user use their own voucher
    if ((voucher.owner as IUser).email === email || (voucher.owner as IUser).email === userEmail) {
      return NextResponse.json({ message: 'You can not use your own voucher' }, { status: 401 })
    }

    // voucher has been used by you
    if (voucher.usedUsers.includes(email || userEmail)) {
      return NextResponse.json(
        { message: 'You have used this voucher already, please use another one!' },
        { status: 401 }
      )
    }

    // voucher has expired => voucher never be expired if expire = null
    if (voucher.expire && new Date() > new Date(voucher.expire)) {
      return NextResponse.json({ message: 'You voucher has been expired' }, { status: 401 })
    }

    // voucher has over used => * voucher can be used infinite times if timesLeft = null
    if ((voucher.timesLeft || 0) <= 0) {
      return NextResponse.json({ message: 'You voucher has been run out of using' }, { status: 401 })
    }

    // not enought total to apply
    if (total < voucher.minTotal) {
      return NextResponse.json(
        {
          message: `Only applies to orders with minimum value of ${formatPrice(voucher.minTotal)}`,
        },
        { status: 401 }
      )
    }

    let message = ''
    switch (voucher.type) {
      case 'fixed-reduce': {
        message = `You get a discount of ${formatPrice(
          Math.abs(+voucher.value)
        )} from the total order value`
        break
      }
      case 'fixed': {
        message = `Your order will cost ${formatPrice(+voucher.value)}`
        break
      }
      case 'percentage': {
        message = `You get a discount of ${voucher.value}, maximum value of ${Intl.NumberFormat(
          'en-US',
          {
            style: 'currency',
            currency: 'USD',
          }
        ).format(voucher.maxReduce)}`
        break
      }
    }

    return NextResponse.json({ voucher, message }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
