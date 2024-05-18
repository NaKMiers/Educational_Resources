import CourseModel from '@/models/CourseModel'
import OrderModel, { IOrder } from '@/models/OrderModel'
import UserModel, { IUser } from '@/models/UserModel'
import VoucherModel, { IVoucher } from '@/models/VoucherModel'
import { NextResponse } from 'next/server'

// Models: Order, Voucher, User, Course
import '@/models/CourseModel'
import '@/models/OrderModel'
import '@/models/UserModel'
import '@/models/VoucherModel'
import { notifyDeliveryOrder } from './sendMail'

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

  // check order exist
  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 })
  }

  // only deliver order with status is 'pending' | 'cancel'
  if (order.status === 'done') {
    return NextResponse.json({ message: 'Order is not ready to deliver' }, { status: 400 })
  }

  // get item and applied voucher
  const { item, email, total } = order

  // error state
  let orderError = {
    error: false,
    message: '',
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
  await UserModel.findOneAndUpdate(
    { email },
    {
      $inc: { expended: total },
      $addToSet: {
        courses: {
          course: item._id,
          process: 0,
        },
      },
    }
  )

  console.log('order', order)

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

  console.log('orderData: ', orderData)

  // EMAIL
  await notifyDeliveryOrder(email, orderData)

  return {
    order,
    isError: orderError.error,
    message: `Deliver Order Successfully`,
  }
}
