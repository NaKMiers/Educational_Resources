import mongoose from 'mongoose'
import { IUser } from './UserModel'
import { ILesson } from './LessonModel'
import { IQuestion } from './QuestionModel'
const Schema = mongoose.Schema

const CommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'lesson',
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'question',
    },
    content: {
      type: String,
      required: true,
    },
    replied: [
      {
        type: Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    hide: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const CommentModel = mongoose.models.comment || mongoose.model('comment', CommentSchema)
export default CommentModel

export interface IComment {
  _id: string
  userId: string | IUser
  lessonId: string | ILesson
  questionId: string | IQuestion
  content: string
  replied: string[] | IComment[]
  likes: string[] | IUser[]
  hide: boolean
  createdAt: string
  updatedAt: string

  // sub
  user?: IUser
}
