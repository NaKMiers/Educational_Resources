import { connectDatabase } from '@/config/database'
import OrderModel from '@/models/OrderModel'
import UserModel from '@/models/UserModel'
import handleDeliverOrder from '@/utils/handleDeliverOrder'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Order
import '@/models/OrderModel'
import '@/models/UserModel'
import { notifyNewOrderToAdmin } from '@/utils/sendMail'

// [POST]: /order/create
export async function POST(req: NextRequest) {
  console.log('- Create Order -')

  try {
    // connect to database
    await connectDatabase()

    // get data to create order
    const { code, email, total, receivedUser, voucherApplied, discount, item, paymentMethod } =
      await req.json()

    // get user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // check if user has already joined course
    let userCourses: any = []

    if (receivedUser) {
      userCourses = await UserModel.findOne({ email: receivedUser }).select('courses').lean()
    } else {
      userCourses = await UserModel.findById(userId).select('courses').lean()
    }

    if (
      userCourses?.courses.map((course: any) => course.course.toString()).includes(item._id.toString())
    ) {
      return NextResponse.json({ message: 'User has already joined this course' }, { status: 400 })
    }

    // create new order
    const newOrder = new OrderModel({
      code,s
      userId,
      email,
      receivedUser,
      voucherApplied,
      discount,
      total,
      item,
      paymentMethod,
    })

    await Promise.all([
      // save new order
      await newOrder.save(),

      // notify user
      await UserModel.findByIdAndUpdate(userId, {
        $push: {
          notifications: {
            _id: new Date().getTime(),
            title: 'You have bought a new course, please wait in a few minutes to get access to course',
            image: '/images/logo.png',
            link: '/my-courses',
            type: 'create-order',
          },
        },
      }),
    ])

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
