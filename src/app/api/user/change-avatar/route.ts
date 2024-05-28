import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { deleteFile, uploadFile } from '@/utils/uploadFile'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PUT]: /user/change-avatar
export async function PUT(req: NextRequest) {
  console.log('- Change Avatar -')

  try {
    // connect to database
    await connectDatabase()

    // get userId to update user
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
    const userId = token?._id
    const oldAvatar: string = token?.avatar as string

    // get data to create product
    const formData = await req.formData()
    let avatar = formData.get('avatar')

    // check userId
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    // check avatar
    if (!avatar) {
      return NextResponse.json({ message: 'No image uploaded' }, { status: 400 })
    }

    // remove old avatar
    await deleteFile(oldAvatar)

    // upload avatar and get imageUrl from AWS S3 Bucket
    const avatarUrl = await uploadFile(avatar, '1:1')

    // update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { avatar: avatarUrl } },
      { new: true }
    )

    // return reponse
    return NextResponse.json(
      {
        updatedUser,
        message: 'Change avatar successfully, please wait in a few seconds to see the changes',
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
