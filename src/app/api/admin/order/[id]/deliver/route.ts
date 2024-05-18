import { connectDatabase } from '@/config/database'
import handleDeliverOrder from '@/utils/handleDeliverOrder'
import { NextRequest, NextResponse } from 'next/server'

// Models: empty

// [PATCH]: /admin/order/:id/deliver
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Deliver Order -')

  try {
    // connect to database
    await connectDatabase()

    // get message
    const { message } = await req.json()

    // handle deliver order
    const response: any = await handleDeliverOrder(id, message)

    if (response.isError) {
      return NextResponse.json({ message: response.message }, { status: 500 })
    }

    // notify delivery order
    return NextResponse.json({ message: response.message }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
