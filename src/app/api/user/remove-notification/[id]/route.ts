import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [DELETE]: /user/remove-notification/:id
export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Remove Notification -')

  try {
    // connect to database
    await connectDatabase()

    // get user id to remove notification
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    console.log('userId:', userId)

    // remove notification
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { notifications: { _id: id } },
    })

    // return response
    return NextResponse.json({ message: 'Notification has been removed' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 })
  }
}
