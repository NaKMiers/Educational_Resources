import { connectDatabase } from '@/config/database'
import CommentModel from '@/models/CommentModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Comment
import '@/models/CommentModel'

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

    // user does not exist
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    // check if questionId or content is empty
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
    const parentComment = await CommentModel.findByIdAndUpdate(
      { _id: id },
      { $push: { replied: newComment._id } }
    )

    // return new comment
    return NextResponse.json(
      { newComment, parentComment, message: 'Reply successfully!' },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
