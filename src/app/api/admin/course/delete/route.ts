import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import CourseModel, { ICourse } from '@/models/CourseModel'
import FlashSaleModel from '@/models/FlashSaleModel'
import LessonModel from '@/models/LessonModel'
import TagModel from '@/models/TagModel'
import { deleteFile } from '@/utils/uploadFile'
import { NextRequest, NextResponse } from 'next/server'

// Models: Product, Category, Tag, Flashsale, Account
import '@/models/CategoryModel'
import '@/models/CourseModel'
import '@/models/FlashSaleModel'
import '@/models/TagModel'

// [DELETE]: /admin/course/delete
export async function DELETE(req: NextRequest) {
  console.log('- Delete Courses - ')

  // connect to database
  await connectDatabase()

  // get course ids to delete
  const { ids } = await req.json()

  try {
    // Find courses by their IDs before deletion
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

        // delete the images associated with each course
        await Promise.all(course.images.map(deleteFile))

        // delete all lessons which associalted with each course and has empty using user
        await LessonModel.deleteMany({
          type: course._id,
        })
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
