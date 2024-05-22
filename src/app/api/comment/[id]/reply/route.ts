import { connectDatabase } from '@/config/database'
import CommentModel, { IComment } from '@/models/CommentModel'
import UserModel, { IUser } from '@/models/UserModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Comment, User
import '@/models/CommentModel'
import '@/models/UserModel'

// [POST]: /comment/add
export async function POST(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Reply Comment - ')

  try {
    // connect to database
    await connectDatabase()

    // get user id to add comment
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // get content to add comment
    const { content } = await req.json()

    // get user commented
    const user: IUser | null = await UserModel.findById(userId)
      .select('username avatar firstName lastName')
      .lean()

    // user does not exist
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    // check if parent comment id or content is empty
    if (!id || !content) {
      // return error
      return NextResponse.json({ message: 'Invalid content' }, { status: 400 })
    }

    // create new comment
    const newComment = new CommentModel({
      userId,
      content: content.trim(),
    })

    // save new comment to database
    await newComment.save()

    // add new comment to parent comment
    const parentComment: IComment | null = await CommentModel.findByIdAndUpdate(
      id,
      {
        $push: { replied: newComment._id },
      },
      { new: true }
    )
      .populate('userId', 'username avatar firstName lastName')
      .lean()

    // parent comment not found
    if (!parentComment) {
      return NextResponse.json({ message: 'Parent comment not found' }, { status: 404 })
    }
    const notifyUserId = parentComment?.userId

    console.log('notifyUserId', notifyUserId)

    // notify user
    await UserModel.findByIdAndUpdate(notifyUserId, {
      $push: {
        notifications: {
          _id: new Date().getTime(),
          title:
            (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username) +
            ' replied on your comment',
          image: user.avatar,
          type: 'replied-comment',
        },
      },
    })

    // return new comment
    return NextResponse.json(
      { newComment, parentComment, message: 'Reply successfully!' },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
