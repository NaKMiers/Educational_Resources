import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PUT]: /user/update-personal-info
export async function PUT(req: NextRequest) {
  console.log('- Update Personal Information -')

  try {
    // connect to database
    await connectDatabase()

    // get user to check authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // get data to update personal info
    const { firstName, lastName, birthday, job, bio } = await req.json()

    // update personal info
    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        firstName,
        lastName,
        birthday,
        job,
        bio,
      },
    })

    // return response
    return NextResponse.json({ message: 'Updated Personal Information' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
