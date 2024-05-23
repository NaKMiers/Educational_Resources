import CourseModel from '@/models/CourseModel'
import OrderModel, { IOrder } from '@/models/OrderModel'
import UserModel, { IUser } from '@/models/UserModel'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'

// Models: Order, Voucher, User, Course
import '@/models/CourseModel'
import '@/models/OrderModel'
import '@/models/UserModel'
import '@/models/VoucherModel'
import { notifyDeliveryOrder, notifyGivenCourse } from './sendMail'

export default async function handleDeliverOrder(id: string, message: string = '') {
  console.log('- Handle Deliver Order -')

  // get order from database to deliver
  const order: IOrder | null = await OrderModel.findById(id)
    .populate({
      path: 'voucherApplied',
      select: 'code',
      populate: 'owner',
    })
    .lean()

  // error state
  let orderError = {
    error: false,
    message: '',
    status: 200,
  }

  // check order exist
  if (!order) {
    throw new Error('Order not found')
  }

  // only deliver order with status is 'pending' | 'cancel'
  if (order.status === 'done') {
    throw new Error('Order is not ready to deliver')
  }

  // get item and applied voucher
  const { item, email, total, userId, receivedUser } = order

  const buyer: IUser | null = await UserModel.findById(userId).lean()

  // buy for themselves
  if (!receivedUser) {
    // get user to check if user has already joined course
    const userCourses: any = buyer?.courses

    if (userCourses.map((course: any) => course.course.toString()).includes(item._id.toString())) {
      throw new Error('User has already joined this course')
    }
  }
  // buy as a gift
  else {
    const receiver: IUser | null = await UserModel.findOne({ email: receivedUser }).lean()
    if (!receiver) {
      throw new Error('Receiver not found')
    }

    const userCourses: any = receiver?.courses
    if (userCourses.map((course: any) => course.course.toString()).includes(item._id.toString())) {
      throw new Error('Receiver has already joined this course')
    }
  }

  // VOUCHER
  const voucher: IVoucher = order.voucherApplied as IVoucher

  if (voucher) {
    const commission: any = (voucher.owner as IUser).commission
    let extraAccumulated = 0

    switch (commission.type) {
      case 'fixed': {
        extraAccumulated = commission.value
        break
      }
      case 'percentage': {
        extraAccumulated = (order.total * parseFloat(commission.value)) / 100
        break
      }
    }

    // update voucher
    await VoucherModel.findByIdAndUpdate(voucher._id, {
      $addToSet: { usedUsers: email },
      $inc: {
        accumulated: extraAccumulated,
        timesLeft: -1,
      },
    })
  }

  // USER
  const emailUser = receivedUser || email
  await UserModel.findOneAndUpdate(
    { email: emailUser },
    {
      $inc: { expended: total },
      $addToSet: {
        courses: {
          course: item._id,
          process: 0,
        },
      },
      // notify user
      $push: {
        notifications: {
          _id: new Date().getTime(),
          title: receivedUser
            ? `You have been given a course by ${
                buyer?.firstName && buyer?.lastName
                  ? `${buyer.firstName} ${buyer.lastName}`
                  : buyer?.username
              }`
            : 'You new course has been delivered',
          image: '/images/logo.png',
          link: '/my-courses',
          type: 'delivered-order',
        },
      },
    }
  )

  // COURSE
  const course = await CourseModel.findByIdAndUpdate(
    order.item._id.toString(),
    {
      $inc: { joined: 1 },
    },
    { new: true }
  )

  // ORDER
  const updatedOrder: IOrder | null = await OrderModel.findByIdAndUpdate(
    order._id.toString(),
    {
      $set: { status: 'done', item: course },
    },
    { new: true }
  ).lean()

  // data transfering to email
  const orderData = {
    ...updatedOrder,
    discount: updatedOrder?.discount || 0,
    message,
  }

  // EMAIL
  await notifyDeliveryOrder(email, orderData)

  // notifiy given course
  if (receivedUser) {
    await notifyGivenCourse(
      receivedUser,
      `${
        buyer?.firstName && buyer?.lastName ? `${buyer.firstName} ${buyer.lastName}` : buyer?.username
      }`,
      orderData
    )
  }

  return {
    order,
    isError: orderError.error,
    message: `Deliver Order Successfully`,
    status: 200,
  }
}
