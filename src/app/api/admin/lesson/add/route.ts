import { connectDatabase } from '@/config/database'
import ChapterModel from '@/models/ChapterModel'
import LessonModel from '@/models/LessonModel'
import UserModel from '@/models/UserModel'
import { uploadFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Lesson, Course, Chapter, User
import '@/models/ChapterModel'
import '@/models/CourseModel'
import '@/models/LessonModel'
import '@/models/UserModel'

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

    // notify to all users who joined course
    await UserModel.updateMany(
      { 'courses.course': courseId },
      {
        $push: {
          notifications: {
            _id: new Date().getTime(),
            title: 'New Lesson Added: ' + title,
            image: '/images/logo.png',
            link: `/learning/${courseId}/${newLesson._id}`,
            type: 'new-lesson',
          },
        },
      }
    )

    // increase lesson quantity in chapter
    await ChapterModel.findByIdAndUpdate(chapterId, { $inc: { lessonQuantity: 1 } })

    // return response
    return NextResponse.json({ message: 'Add lesson successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
