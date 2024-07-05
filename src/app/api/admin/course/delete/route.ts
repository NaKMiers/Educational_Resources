import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import ChapterModel from '@/models/ChapterModel'
import CourseModel, { ICourse } from '@/models/CourseModel'
import FlashSaleModel from '@/models/FlashSaleModel'
import LessonModel from '@/models/LessonModel'
import TagModel from '@/models/TagModel'
import UserModel from '@/models/UserModel'
import { deleteFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Course, Category, Tag, FlashSale, User, Chapter, Lesson
import '@/models/CategoryModel'
import '@/models/ChapterModel'
import '@/models/CourseModel'
import '@/models/FlashSaleModel'
import '@/models/LessonModel'
import '@/models/TagModel'
import '@/models/UserModel'

// [DELETE]: /admin/course/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Courses - ')

  try {
    // connect to database
    await connectDatabase()

    // get course ids to delete
    const { ids } = await req.json()

    // only allow to delete courses if no users are joining them
    const userExists = await UserModel.exists({ 'courses.course': { $in: ids } })
    if (userExists) {
      return NextResponse.json(
        { message: 'Cannot delete courses that has users are learning' },
        { status: 400 }
      )
    }

    // only allow to delete courses if no chapters are associated with them
    const chapterExists = await ChapterModel.exists({ courseId: { $in: ids } })
    if (chapterExists) {
      return NextResponse.json(
        { message: 'Cannot delete courses. Please delete all related chapters first' },
        { status: 400 }
      )
    }

    // only allow to delete courses if no lessons are associated with them
    const lessonExists = await LessonModel.exists({ courseId: { $in: ids } })
    if (lessonExists) {
      return NextResponse.json(
        { message: 'Cannot delete courses. Please delete all related lessons first' },
        { status: 400 }
      )
    }

    // find courses by their IDs before deletion
    const courses: ICourse[] = await CourseModel.find({
      _id: { $in: ids },
    }).lean()

    // delete course by ids
    await CourseModel.deleteMany({
      _id: { $in: ids },
    })

    // decrease course quantity filed in related categories, tags, and flashSales, and delete the images associated with each course
    await Promise.all(
      courses.map(async course => {
        // decrease related categories course quantity
        await CategoryModel.updateMany(
          { _id: { $in: course.categories } },
          {
            $inc: {
              courseQuantity: -1,
            },
          }
        )

        // decrease related tags course quantity
        await TagModel.updateMany(
          { _id: { $in: course.tags } },
          {
            $inc: {
              courseQuantity: -1,
            },
          }
        )

        // decrease related flashSales course quantity
        if (course.flashSale) {
          await FlashSaleModel.updateOne(
            { _id: course.flashSale },
            {
              $inc: {
                courseQuantity: -1,
              },
            }
          )
        }

        // remove all courses from the user's joining this course
        await UserModel.updateMany({ 'courses.course': course._id }, { $pull: { courses: course._id } })

        // delete the images associated with each course
        await Promise.all(course.images.map(image => deleteFile(image)))
      })
    )

    // return deleted courses
    return NextResponse.json(
      {
        deletedCourses: courses,
        message: `${courses.map(course => course.title).join(', ')} ${
          courses.length > 1 ? 'have' : 'has'
        } been deleted`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
