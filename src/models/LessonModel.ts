import mongoose from 'mongoose'
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

const LessonModel = mongoose.models.lesson || mongoose.model('lesson', LessonSchema)
export default LessonModel

export interface ILesson {
  courseId: string
  title: string
  slug: string
  duration: number
  source: string
  description: string
  active: boolean
  likes: string[]
  createdAt: Date
  updatedAt: Date
}
