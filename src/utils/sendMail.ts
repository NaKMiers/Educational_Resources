import NotifyOrderEmail from '@/components/email/NotifyOrderEmail'
import OrderEmail from '@/components/email/OrderEmail'
import ResetPasswordEmail from '@/components/email/ResetPasswordEmail'
import SummaryEmail from '@/components/email/SummaryEmail'
import VerifyEmailEmail from '@/components/email/VerifyEmailEmail'
import UserModel from '@/models/UserModel'
import { render } from '@react-email/render'
import nodeMailer from 'nodemailer'

// Models: User
import '@/models/UserModel'

// SEND MAIL CORE
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_MAIL,
    pass: process.env.MAIL_APP_PASSWORD,
  },
})

export async function sendMail(to: string | string[], subject: string, html: string) {
  console.log('- Send Mail -')

  await transporter.sendMail({
    from: 'ERE <no-reply@anpha.shop>',
    to: to,
    subject: subject,
    html: html,
  })
}

// send order notification to admin
export async function notifyNewOrderToAdmin(newOrder: any) {
  console.log('- Notify New Order To Admin -')

  try {
    // get admin and editor mails
    const admins: any[] = await UserModel.find({
      role: { $in: ['admin', 'editor'] },
    }).lean()
    let emails: string[] = [...admins.map(admin => admin.email), process.env.NEXT_PUBLIC_MAIL]

    const html = render(NotifyOrderEmail({ order: newOrder }))
    await sendMail(emails, 'New Order', html)
  } catch (err: any) {
    console.log(err)
  }
}

// deliver notification
export async function notifyDeliveryOrder(email: string, orderData: any) {
  console.log('- Notify Delivery Order -')

  try {
    const html = render(OrderEmail({ order: orderData }))
    await sendMail(email, 'Bạn có đơn hàng từ ERE', html)
  } catch (err: any) {
    console.log(err)
  }
}

// summary notification
export async function summaryNotification(email: string, summary: any) {
  console.log('- Summary Notification -')

  try {
    // Render template với dữ liệu
    const html = render(SummaryEmail({ summary }))
    await sendMail(email, `Báo cáo thu nhập tháng ${new Date().getMonth() + 1}`, html)
  } catch (err: any) {
    console.log(err)
  }
}

// reset password email
export async function sendResetPasswordEmail(email: string, name: string, link: string) {
  console.log('- Send Reset Password Email -')

  try {
    // Render template với dữ liệu
    const html = render(ResetPasswordEmail({ name, link }))

    console.log('html', html)

    await sendMail(email, 'Khôi phục mật khẩu', html)
  } catch (err: any) {
    console.log(err)
  }
}

// verify email
export async function sendVerifyEmail(email: string, name: string, link: string) {
  console.log('- Send Verify Email -')

  try {
    // Render template với dữ liệu
    const html = render(VerifyEmailEmail({ name, link }))
    await sendMail(email, 'Xác minh email', html)
  } catch (err: any) {
    console.log(err)
  }
}

// verify phone
export async function sendVerifyPhone(phone: string, name: string, code: string) {
  console.log('- Send Verify Phone -')
}
