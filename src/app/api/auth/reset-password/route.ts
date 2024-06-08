import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'

// Models: User
import '@/models/UserModel'

// [PATHC]: /auth/reset-password
export async function PATCH(req: NextRequest) {
  console.log('- Reset Password -')

  try {
    // connect to database
    await connectDatabase()

    // get email and token from query
    const searchParams = req.nextUrl.searchParams
    const token = searchParams.get('token')

    // get new password from req body
    const { newPassword } = await req.json()

    // if token is not exist
    if (!token) {
      return NextResponse.json({ message: 'Token không tồn tại' }, { status: 401 })
    }

    // verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    // check decode is exist
    if (!decode) {
      return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 401 })
    }

    // check expired time
    const currentTime = Math.floor(Date.now() / 1000)
    if ((decode.exp || 0) < currentTime) {
      return NextResponse.json({ message: 'Link khôi phục đã hết hạn' }, { status: 401 })
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, +process.env.BCRYPT_SALT_ROUND!)
    await UserModel.findOneAndUpdate({ email: decode.email }, { $set: { password: hashedPassword } })

    // return success message
    return NextResponse.json({ message: 'Mật khẩu đã được thay đổi' })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
