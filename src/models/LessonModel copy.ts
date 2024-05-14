import { generateSlug } from '@/utils'
import mongoose from 'mongoose'
import { ICourse } from './CourseModel'
import { IUser } from './UserModel'
const Schema = mongoose.Schema

const LessonSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'course',
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    sourceType: {
      type: String,
      required: true,
      enum: ['file', 'embed'],
    },
    source: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  { timestamps: true }
)

// pre-save hook to generate slug from title
LessonSchema.pre('save', function (next) {
  console.log('- Pre-Save Lesson -')

  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
  }
  next()
})

const LessonModel = mongoose.models.lesson || mongoose.model('lesson', LessonSchema)
export default LessonModel

export interface ILesson {
  _id: string
  courseId: string | ICourse
  title: string
  sourceType: 'embed' | 'file'
  slug: string
  duration: number
  source: string
  description: string
  active: boolean
  likes: string[] | IUser[]
  createdAt: string
  updatedAt: string
}
