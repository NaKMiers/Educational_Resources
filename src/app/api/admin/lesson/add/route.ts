import { connectDatabase } from '@/config/database'
import LessonModel from '@/models/LessonModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Course
import '@/models/CourseModel'
import '@/models/LessonModel'
import { uploadFile } from '@/utils/uploadFile'

// [POST]: /admin/lesson/add
export async function POST(req: NextRequest) {
  console.log('- Add Lesson - ')

  try {
    // connect to database
    await connectDatabase()

    // get data to create lesson
    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    const { courseId, chapterId, title, description, duration, active, embedUrl } = data
    let file = formData.get('file')

    console.log('data', data)
    console.log('file', file)

    if (!file && !embedUrl) {
      return NextResponse.json({ message: 'Source or embed is required' }, { status: 400 })
    }

    // check file
    let source: string = ''
    if (embedUrl) {
      source = embedUrl as string
    } else if (file) {
      source = await uploadFile(file, '16:9', 'video')
    }

    console.log('source', source)

    // create new lesson
    const newLesson = new LessonModel({
      courseId,
      chapterId,
      title,
      duration,
      sourceType: embedUrl ? 'embed' : 'file',
      source,
      description,
      active,
    })

    // save new lesson to database
    await newLesson.save()

    // return response
    return NextResponse.json({ message: 'Add lesson successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
