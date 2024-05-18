import { connectDatabase } from '@/config/database'
import OrderModel from '@/models/OrderModel'
import handleDeliverOrder from '@/utils/handleDeliverOrder'
import { notifyNewOrderToAdmin } from '@/utils/sendMail'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import UserModel from '@/models/UserModel'

// Models: User, Order
import '@/models/OrderModel'
import '@/models/UserModel'

// [POST]: /order/create
export async function POST(req: NextRequest) {
  console.log('- Create Order -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create order
    const { code, email, total, voucherApplied, discount, item, paymentMethod } = await req.json()
    console.log({ code, email, total, voucherApplied, discount, item, paymentMethod })

    // get user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // check if user has already joined course
    const userCourses: any = await UserModel.findById(userId).select('courses').lean()
    console.log(userCourses?.courses.map((course: any) => course.course.toString()))
    console.log('item._id.toString()', item._id.toString())

    if (
      userCourses?.courses.map((course: any) => course.course.toString()).includes(item._id.toString())
    ) {
      return NextResponse.json({ message: 'User has already joined this course' }, { status: 400 })
    }

    // create new order
    const newOrder = new OrderModel({
      code,
      userId,
      email,
      voucherApplied,
      discount,
      total,
      item,
      paymentMethod,
    })
    // save new order
    await newOrder.save()

    // auto deliver order
    let response: any = null
    if (process.env.IS_AUTO_DELIVER === 'YES') {
      handleDeliverOrder(newOrder._id)
    }

    // return new order
    const message =
      response && response.isError
        ? 'Your order is being processed, please wait'
        : 'Your order has been sent to email ' + email

    // notify new order to admin
    await notifyNewOrderToAdmin(newOrder)

    return NextResponse.json({ message }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
