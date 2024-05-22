import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PATCH]: /admin/user/:id/block-add-question
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Block Add Question -')

  try {
    // connect to database
    await connectDatabase()

    // get values from request body
    const { value } = await req.json()

    // block / unblock user comment
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: { 'blockStatuses.blockedAddingQuestion': value } },
      { new: true }
    )

    return NextResponse.json({
      updatedUser,
      message: `User has been ${value ? 'blocked' : 'unblocked'} adding question`,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
