import { connectDatabase } from '@/config/database'
import OrderModel, { IOrder } from '@/models/OrderModel'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'
import { notifyDeliveryOrder } from '@/utils/sendMail'
import { NextRequest, NextResponse } from 'next/server'

// Models: Order, Voucher
import '@/models/OrderModel'
import '@/models/VoucherModel'

// [PATCH]: /admin/order/:id/re-deliver
export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  console.log('- Re-Deliver Order -')

  try {
    // connect to database
    await connectDatabase()

    // get message
    const { message } = await req.json()

    // get order to re-deliver
    let order: IOrder | null = await OrderModel.findById(id).lean<IOrder>()

    // voucher does not exist
    if (!order) {
      return NextResponse.json({ message: 'Order does not exist!' }, { status: 404 })
    }

    if (order.status !== 'done') {
      return NextResponse.json({ message: 'Order has not done yet!' }, { status: 400 })
    }

    const { email, discount } = order

    // data transferring to email
    const orderData = {
      ...order,
      discount,
      message,
    }

    // EMAIL
    await notifyDeliveryOrder(email, orderData)

    // stay in current page
    return NextResponse.json({ message: `Re-deliver Order Successfully!` }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
