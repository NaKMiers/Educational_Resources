// import { FullyOrder } from '@/app/api/user/order-history/route'
// import AccountModel, { IAccount } from '@/models/AccountModel'
// import OrderModel from '@/models/OrderModel'
// import CourseModel from '@/models/CourseModel'
// import UserModel from '@/models/UserModel'
// import VoucherModel from '@/models/VoucherModel'
// import { notifyDeliveryOrder, notifyShortageAccount } from '@/utils/sendMail'
// import { calcExpireTime } from '@/utils/time'
// import { NextResponse } from 'next/server'

// // Models: Order, Account, Voucher, User, Course
// import '@/models/AccountModel'
// import '@/models/OrderModel'
// import '@/models/CourseModel'
// import '@/models/UserModel'
// import '@/models/VoucherModel'

// interface AccountListItem {
//   courseId: string
//   quantity: number
//   accounts: any[]
// }

// export default async function handleDeliverOrder(id: string, message: string = '') {
//   // get order from database to deliver
//   const order: FullyOrder | null = await OrderModel.findById(id)
//     .populate({
//       path: 'voucherApplied',
//       select: 'code',
//       populate: 'owner',
//     })
//     .lean()

//   // check order exist
//   if (!order) {
//     return NextResponse.json({ message: 'Order not found' }, { status: 404 })
//   }

//   // only deliver order with status is 'pending' | 'cancel'
//   if (order.status === 'done') {
//     return NextResponse.json({ message: 'Order is not ready to deliver' }, { status: 400 })
//   }

//   // get items and applied voucher
//   const { items, email, paymentMethod, total } = order

//   // error state
//   let orderError = {
//     error: false,
//     message: '',
//   }

//   // ACCOUNT
//   const getAccounts = async (courseId: string, quantity: number) => {
//     const currentDate = new Date()

//     return await AccountModel.find({
//       type: courseId, // corresponding course
//       renew: { $gte: currentDate }, // still in time of using
//       $and: [
//         {
//           $or: [
//             { active: true }, // active: true
//             { active: null }, // active: true
//             { active: { $exists: false } }, // active does not exist
//           ],
//         },
//         {
//           $or: [
//             { usingUser: null }, // using user does not exist
//             { usingUser: { $exists: false } }, // using user does not exist
//           ],
//         },
//         {
//           $or: [
//             { expire: { $lt: currentDate } }, // expired
//             { expire: { $exists: false } }, // expire does not exist
//             { expire: null }, // expire does not exist
//           ],
//         },
//       ],
//     })
//       .limit(quantity)
//       .lean()
//   }

//   // get accountsList
//   const handleItemsToAccounts = async () => {
//     const results: AccountListItem[] = []

//     for (const { course, quantity } of items) {
//       const accounts = await getAccounts(course._id, +quantity)

//       if (accounts.length !== +quantity) {
//         orderError = {
//           error: true,
//           message: `Thiếu sản phẩm: ${course.title}`,
//         }
//         break
//       } else {
//         results.push({
//           courseId: course._id,
//           quantity,
//           accounts,
//         })
//       }
//     }

//     return results
//   }
//   const accountDataList: AccountListItem[] = await handleItemsToAccounts()

//   // check if shortage accounts
//   if (orderError.error) {
//     await notifyShortageAccount(orderError.message)
//     return { order, isError: orderError.error, message: orderError.message }
//   }

//   // prepare a list of step to update accounts
//   let accounts: any[] = accountDataList.map(accData => accData.accounts)
//   accounts = accounts.reduce((result, item) => result.concat(item), [])
//   const bulkOpsAccounts = accounts.map(account => {
//     const { days, hours, minutes, seconds } = account.times

//     return {
//       updateOne: {
//         filter: { _id: account._id },
//         update: {
//           $set: {
//             begin: new Date(),
//             expire: calcExpireTime(days, hours, minutes, seconds),
//             usingUser: email,
//           },
//         },
//       },
//     }
//   })

//   // PRODUCT
//   // prepared a list of steps to update course
//   const bulkOpsCourses = accountDataList.map(accData => {
//     const { courseId, quantity } = accData

//     return {
//       updateOne: {
//         filter: { _id: courseId },
//         update: {
//           $inc: {
//             sold: +quantity,
//             stock: -1 * +quantity,
//           },
//         },
//       },
//     }
//   })

//   // VOUCHER
//   // get voucher form database
//   const voucher = order.voucherApplied

//   if (voucher) {
//     const commission: any = voucher.owner.commission
//     let extraAccumulated = 0

//     switch (commission.type) {
//       case 'fixed': {
//         extraAccumulated = commission.value
//         break
//       }
//       case 'percentage': {
//         extraAccumulated = (order.total * parseFloat(commission.value)) / 100
//         break
//       }
//     }

//     // update voucher
//     await VoucherModel.findByIdAndUpdate(voucher._id, {
//       $addToSet: { usedUsers: email },
//       $inc: {
//         accumulated: extraAccumulated,
//         timesLeft: -1,
//       },
//     })
//   }

//   // USER
//   // check balance payment method
//   if (paymentMethod === 'balance') {
//     await UserModel.findByIdAndUpdate(order.userId, {
//       $inc: { balance: -total },
//     })
//   }

//   // update order items with accounts
//   const updatedItems = items.map(item => {
//     let accounts = accountDataList.find(acc => acc.courseId.toString() === item.course._id.toString())
//     if (!accounts) {
//       return item
//     }
//     return { ...item, accounts: accounts.accounts }
//   })

//   // do all the list of step preparation for accounts
//   await AccountModel.bulkWrite(bulkOpsAccounts)
//   // do all the list of step preparation for courses
//   await CourseModel.bulkWrite(bulkOpsCourses)
//   // set order status
//   await OrderModel.findByIdAndUpdate(order._id, {
//     $set: { status: 'done' },
//   })
//   await OrderModel.findByIdAndUpdate(order._id, {
//     $set: { items: updatedItems },
//   })

//   // data transfering to email
//   const orderData = {
//     ...order,
//     accounts: accountDataList,
//     discount: order.discount || 0,
//     message,
//   }

//   // EMAIL
//   await notifyDeliveryOrder(email, orderData)

//   return {
//     order,
//     isError: orderError.error,
//     message: `Deliver Order Successfully`,
//   }
// }
