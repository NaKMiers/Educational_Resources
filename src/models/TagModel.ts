import { generateSlug } from '@/utils'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TagSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    courseQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    booted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// pre-save hook to generate slug from title
TagSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
  }
  next()
})

const TagModel = mongoose.models.tag || mongoose.model('tag', TagSchema)
export default TagModel

export interface ITag {
  _id: string
  title: string
  slug: string
  courseQuantity: number
  booted: boolean
  createdAt: string
  updatedAt: string
}
