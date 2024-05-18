import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import bcrypt from 'bcrypt'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PUT]: /user/update-private-info
export async function PUT(req: NextRequest) {
  console.log('- Update Private Info -')

  try {
    // connect to database
    await connectDatabase()

    // get user to check authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id
    const email = token?.email
    const phone = token?.phone

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // get data to update personal info
    const { email: newEmail, phone: newPhone, newPassword } = await req.json()

    const set: any = {}

    // check email
    if (newEmail.trim() && email !== newEmail) {
      const existingUser = await UserModel.findOne({ email: newEmail }).lean()

      // check if email is already taken
      if (existingUser) {
        return NextResponse.json({ message: 'Email is already taken' }, { status: 400 })
      }

      set.email = newEmail
    }

    // check phone
    if (newPhone.trim() && newPhone !== phone) {
      const existingUser = await UserModel.findOne({ phone: newPhone }).lean()

      // check if phone is already taken
      if (existingUser) {
        return NextResponse.json({ message: 'Phone is already taken' }, { status: 400 })
      }

      set.phone = newPhone
    }

    // new password exists
    let newHashedPassword = ''
    if (newPassword) {
      // hash new password
      newHashedPassword = await bcrypt.hash(newPassword, +process.env.BCRYPT_SALT_ROUND! || 10)

      set.password = newHashedPassword
    }

    // update personal info
    const asd = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: set,
      },
      { new: true }
    )

    // return response
    return NextResponse.json({ message: 'Updated Private Information' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
