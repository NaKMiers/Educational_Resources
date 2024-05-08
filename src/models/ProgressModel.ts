import mongoose from 'mongoose'
import { ICourse } from './CourseModel'
import { IUser } from './UserModel'
import { ILesson } from './LessonModel'
const Schema = mongoose.Schema

const ProgressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'course',
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'lesson',
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
)

const ProgressModel = mongoose.models.progress || mongoose.model('progress', ProgressSchema)
export default ProgressModel

export interface IProgress {
  _id: string
  userId: string | IUser
  courseId: string | ICourse
  lessonId: string | ILesson
  status: string
  progress: number
  createdAt: string
  updatedAt: string
}
