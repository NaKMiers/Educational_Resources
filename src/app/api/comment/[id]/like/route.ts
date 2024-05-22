import { connectDatabase } from '@/config/database'
import CommentModel, { IComment } from '@/models/CommentModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

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

    // user does not exist
    if (!userId) {
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

    // return response
    return NextResponse.json(
      { comment, message: `${value === 'y' ? 'Like' : 'Dislike'} successfully` },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
