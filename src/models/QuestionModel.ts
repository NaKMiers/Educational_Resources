import { generateSlug } from '@/utils'
import mongoose from 'mongoose'
import { IUser } from './UserModel'
const Schema = mongoose.Schema

const QuestionSchema = new Schema(
  {
    title: {
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
  },
  { timestamps: true }
)

// pre-save hook to generate slug from title
QuestionSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
  }
  next()
})

const QuestionModel = mongoose.models.question || mongoose.model('question', QuestionSchema)
export default QuestionModel

export interface IQuestion {
  _id: string
  userId: string | IUser
  title: string
  slug: string
  status: string
  createdAt: string
  updatedAt: string
}
