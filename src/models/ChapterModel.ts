import { generateSlug } from '@/utils'
import mongoose from 'mongoose'
import { ICourse } from './CourseModel'
import { ILesson } from './LessonModel'
const Schema = mongoose.Schema

const ChapterSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'course',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    lessonQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// pre-save hook to generate slug from title
ChapterSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
  }
  next()
})

const ChapterModel = mongoose.models.chapter || mongoose.model('chapter', ChapterSchema)
export default ChapterModel

export interface IChapter {
  _id: string
  courseId: string | ICourse
  title: string
  content: string
  slug: string
  lessonQuantity: number
  order: number
  createdAt: Date
  updatedAt: Date

  // sub
  lessons?: ILesson[]
}
