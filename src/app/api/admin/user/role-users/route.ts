import { connectDatabase } from '@/config/database'
import UserModel from '@/models/UserModel'
import { NextResponse } from 'next/server'

// Models: User
import '@/models/UserModel'

export const dynamic = 'force-dynamic'

// [GET]: /admin/user/role-users
export async function GET() {
  console.log('- Get Role-Users -')

  try {
    // connect to database
    await connectDatabase()

    // get special role users from database
    let roleUsers = await UserModel.find({
      role: { $in: ['admin', 'editor', 'collaborator'] },
    }).lean()

    // group admins, editors, collaborators
    const admins = roleUsers.filter(user => user.role === 'admin')
    const editors = roleUsers.filter(user => user.role === 'editor')
    const collaborators = roleUsers.filter(user => user.role === 'collaborator')

    roleUsers = [...admins, ...editors, ...collaborators]

    // return collaborators, admins, editors
    return NextResponse.json({ roleUsers, message: 'Get collaborators successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
