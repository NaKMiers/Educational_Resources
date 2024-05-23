import { connectDatabase } from '@/config/database'
import UserModel, { IUser } from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'
import { getToken } from 'next-auth/jwt'

// [GET]: /api/user/:id
export async function GET(req: NextRequest, { params: { email } }: { params: { email: string } }) {
  console.log('- Find User -')

  try {
    // connect to database
    await connectDatabase()

    // get curent user
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
    const curUserEmail = token?.email

    // check if curUserEmail = email
    if (curUserEmail === email) {
      return NextResponse.json(
        { message: 'You cannot buy course for yourself as a gift' },
        { status: 401 }
      )
    }

    // get user by email
    let user: IUser | null = await UserModel.findOne({ email }).lean()

    // check if user exists
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // return user
    return NextResponse.json({ user, message: 'Get user successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
