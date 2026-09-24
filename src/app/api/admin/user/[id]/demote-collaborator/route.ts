import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

// [PATCH]: /admin/user/:id/set-collaborator
export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  console.log('- Remove Collaborator - ')

  try {
    // connect to database
    await connectDatabase()

    // remove collaborator
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          role: 'user',
        },
        $unset: {
          commission: 1,
        },
      },
      { new: true }
    )

    // stay in current page
    return NextResponse.json({
      message: `Collaborator "${updatedUser.email}" has been demoted`,
      user: updatedUser,
    })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
