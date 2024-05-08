import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { formatPrice } from '@/utils/number'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PATCH]: /admin/user/:id/set-collaborator
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Set Collaborator - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to set collaborator
    const { type, value } = await req.json()

    // set collaborator
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          role: 'collaborator',
          commission: { type, value: value.trim() },
        },
      },
      { new: true }
    )

    // check user
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // return response
    return NextResponse.json(
      {
        user,
        message: `User ${
          user.username || user.email
        } has been set as a collaborator with a commission of ${formatPrice(user.commission.value)}`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
