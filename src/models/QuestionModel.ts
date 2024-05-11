import { generateSlug } from '@/utils'
import mongoose from 'mongoose'
import { IUser } from './UserModel'
const Schema = mongoose.Schema

const QuestionSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    commentAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// pre-save hook to generate slug from content
QuestionSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    this.slug = generateSlug(this.content)
  }
  next()
})

const QuestionModel = mongoose.models.question || mongoose.model('question', QuestionSchema)
export default QuestionModel

export interface IQuestion {
  _id: string
  userId: string | IUser
  content: string
  slug: string
  status: string
  likes: string[]
  commentAmount: number
  createdAt: string
  updatedAt: string
}
