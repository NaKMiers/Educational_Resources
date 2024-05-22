import { connectDatabase } from '@/config/database'
import CommentModel from '@/models/CommentModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Models: Comment
import '@/models/CommentModel'

// [POST]: /comment/add
export async function POST(req: NextRequest) {
  console.log('- Add Comment - ')

  try {
    // connect to database
    await connectDatabase()

    // get user id to add comment
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
    const userId = token?._id

    // get product id and content to add comment
    const { questionId, lessonId, content } = await req.json()

    // user does not exist
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    }

    // check if productId or content is empty
    if ((!questionId && !lessonId) || !content) {
      // return error
      return NextResponse.json({ message: 'Invalid content' }, { status: 400 })
    }

    // create new comment
    const comment = new CommentModel({
      userId,
      questionId,
      lessonId,
      content: content.trim(),
    })

    // save new comment to database
    await comment.save()

    // return new comment
    return NextResponse.json({ newComment: comment, message: 'Comment Successfully!' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
