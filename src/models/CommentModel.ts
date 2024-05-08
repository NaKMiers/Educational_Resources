import mongoose from 'mongoose'
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
  userId: string
  lessonId: string
  questionId: string
  content: string
  replied: string[]
  likes: string[]
  hide: boolean
  createdAt: Date
  updatedAt: Date
}
