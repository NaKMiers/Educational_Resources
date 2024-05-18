import { generateOrderCode } from './../../../../utils/index'
import { connectDatabase } from '@/config/database'
import { NextResponse } from 'next/server'

// Models:

export const dynamic = 'force-dynamic'

// [GET]: /order/generate-order-code
export async function GET() {
  console.log('- Generate Order Code - ')

  try {
    // connect to database
    await connectDatabase()

    // generate order code
    const orderCode = await generateOrderCode(5)

    // return code
    return NextResponse.json({ code: orderCode }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
