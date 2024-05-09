import { generateSlug } from '@/utils'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CategorySchema = new Schema(
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
CategorySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
  }
  next()
})

const CategoryModel = mongoose.models.category || mongoose.model('category', CategorySchema)
export default CategoryModel

export interface ICategory {
  _id: string
  title: string
  slug: string
  courseQuantity: number
  booted: boolean
  createdAt: string
  updatedAt: string
}
