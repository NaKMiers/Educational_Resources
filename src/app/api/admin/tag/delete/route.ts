import { connectDatabase } from '@/config/database'
import TagModel from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'
import CourseModel from '@/models/CourseModel'

// Models: Tag, Course
import '@/models/TagModel'
import '@/models/CourseModel'

// [DELETE]: /admin/tag/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Tags - ')

  try {
    // connect to database
    await connectDatabase()

    // get tag ids to delete
    const { ids } = await req.json()

    // only allow to delete tags if no courses are associated with them
    const courseExists = await CourseModel.exists({ tags: { $in: ids } })
    if (courseExists) {
      return NextResponse.json({ message: 'Cannot delete tags that have courses' }, { status: 400 })
    }

    // get delete tags
    const deletedTags = await TagModel.find({ _id: { $in: ids } }).lean()

    // delete tag from database
    await TagModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json(
      {
        deletedTags,
        message: `Tag ${deletedTags
          .map(tag => `"${tag.title}"`)
          .reverse()
          .join(', ')} ${deletedTags.length > 1 ? 'have' : 'has'} been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
