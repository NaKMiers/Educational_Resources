import { connectDatabase } from '@/config/database'
import TagModel from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Tag
import '@/models/TagModel'

// [PATCH]: /admin/tag/feature
export async function PATCH(req: NextRequest) {
  console.log('- Feature Tags - ')

  try {
    // connect to database
    await connectDatabase()

    // get tag id to delete
    const { ids, value } = await req.json()

    // update tags from database
    await TagModel.updateMany({ _id: { $in: ids } }, { $set: { isFeatured: value || false } })

    // get updated tags
    const updatedTags = await TagModel.find({ _id: { $in: ids } }).lean()

    if (!updatedTags.length) {
      throw new Error('No tag found')
    }

    // return response
    return NextResponse.json(
      {
        updatedTags,
        message: `Tag ${updatedTags
          .map(tag => `"${tag.title}"`)
          .reverse()
          .join(', ')} ${updatedTags.length > 1 ? 'have' : 'has'} been featured`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
