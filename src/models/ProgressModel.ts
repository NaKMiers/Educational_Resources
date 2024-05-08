import mongoose from 'mongoose'
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
  userId: string
  courseId: string
  lessonId: string
  status: string
  progress: number
  createdAt: Date
  updatedAt: Date
}
