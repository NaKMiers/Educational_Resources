import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { sendResetPasswordEmail } from '@/utils/sendMail'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [POST]: /auth/forgot-password
export async function POST(req: NextRequest) {
  console.log('- Forgot Password -')

  try {
    // connect to database
    await connectDatabase()

    // get email to send link to reset password
    const { email } = await req.json()

    // get user by email
    const user: any = await UserModel.findOne({ email }).lean()

    // check if email exists
    if (!user) {
      return NextResponse.json({ message: 'Email không tồn tại' }, { status: 404 })
    }

    // check if user is not local
    if (user.authType !== 'local') {
      return NextResponse.json(
        {
          message: `Email này được xác thực bởi ${user.authType}, bạn không thể thực hiện tính năng này`,
        },
        { status: 500 }
      )
    }

    // ready for sending email
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '2h' })
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`

    const name =
      (user.firstName && user.lastname ? `${user.firstName} ${user.lastName}` : user.username) ||
      user.email

    // send email
    await sendResetPasswordEmail(email, name, link)

    // return response
    return NextResponse.json({
      sending: true,
      email,
      message: 'Link khôi phục mật khẩu đã được gửi đến email của bạn',
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
