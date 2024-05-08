import { connectDatabase } from '@/config/database'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'
import UserModel, { IUser } from '@/models/UserModel'
import { sendVerifyEmail } from '@/utils/sendMail'

// [POST]: /auth/verify-email
export async function POST(req: NextRequest) {
  console.log('- Verify Email - ')

  try {
    // connect to database
    await connectDatabase()

    // get email to send verification email
    const { email } = await req.json()

    // get email and token from query
    const searchParams = req.nextUrl.searchParams
    const token = searchParams.get('token')

    // get user to check
    const user: IUser | null = await UserModel.findOne({ email }).lean()

    // check if email is exist in the database
    if (!user) {
      return NextResponse.json({ message: 'Email không tồn tại' }, { status: 404 })
    }

    // check if email is verified
    if (user.verifiedEmail) {
      return NextResponse.json({ message: 'Email đã được xác minh' }, { status: 200 })
    }

    // if token is not exist => SEND verify email
    if (!token) {
      // send verification email
      const sendToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '2h' })
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/user?token=${sendToken}`

      const name =
        (user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username) ||
        user.email

      // send email
      await sendVerifyEmail(email, name, link)

      return NextResponse.json(
        {
          message: `Đã gửi email xác minh tới địa chỉ ${email}. Vui lòng kiểm tra email của bạn.`,
        },
        { status: 200 }
      )
    }

    // token is exist => verify email
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    // check edcode is exist
    if (!decode) {
      return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 401 })
    }

    // check expired time
    const currentTime = Math.floor(Date.now() / 1000)
    if ((decode.exp || 0) < currentTime) {
      return NextResponse.json({ message: 'Link khôi phục đã hết hạn' }, { status: 401 })
    }

    // update user isVerified = true
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: decode.email },
      { $set: { verifiedEmail: true } },
      { new: true }
    )

    return NextResponse.json({ updatedUser, message: 'Xác minh email thành công' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
