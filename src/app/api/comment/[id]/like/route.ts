import { connectDatabase } from '@/config/database'
import CommentModel, { IComment } from '@/models/CommentModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import UserModel, { IUser } from '@/models/UserModel'

// Models: Comment, User
import '@/models/CommentModel'
import '@/models/UserModel'

// [PATCH]: /comment/:id/like
export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Like Comment -')

  try {
    // connect to database
    await connectDatabase()

    // get current user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?._id

    // get id and value to like to dislike
    const { value } = await req.json()

    // get user liked / disliked
    const user: IUser | null = await UserModel.findById(userId)
      .select('username avatar firstName lastName')
      .lean()

    // user does not exist
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    let updatedComment: any = null
    if (value === 'y') {
      // like
      updatedComment = await CommentModel.findByIdAndUpdate(
        id,
        { $addToSet: { likes: userId } },
        { new: true }
      )
        .populate('userId')
        .populate({
          path: 'replied',
          populate: {
            path: 'userId',
          },
        })
        .lean()
    } else if (value === 'n') {
      // dislike
      updatedComment = await CommentModel.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { new: true }
      )
        .populate('userId')
        .populate({
          path: 'replied',
          populate: {
            path: 'userId',
          },
          options: { sort: { likes: -1, createdAt: -1 }, limit: 6 },
        })
        .lean()
    }

    if (!updatedComment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 })
    }

    // format comment
    const comment: IComment = {
      ...updatedComment,
      userId: updatedComment.userId._id,
      user: updatedComment.userId,
      replied: updatedComment.replied.map((c: any) => ({
        ...c,
        userId: c.userId._id,
        user: c.userId,
      })),
    }

    // notify user only if like
    if (value === 'y' && updatedComment.userId._id !== userId) {
      await UserModel.findByIdAndUpdate(updatedComment.userId._id, {
        $push: {
          notifications: {
            _id: new Date().getTime(),
            title:
              (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username) +
              ' liked on your comment',
            image: user.avatar,
            type: 'emotion-comment',
          },
        },
      })
    }

    // return response
    return NextResponse.json(
      { comment, message: `${value === 'y' ? 'Like' : 'Dislike'} successfully` },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
