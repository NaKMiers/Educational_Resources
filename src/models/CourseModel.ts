import { generateSlug } from '@/utils'
import mongoose from 'mongoose'
import { ICategory } from './CategoryModel'
import { IChapter } from './ChapterModel'
import { IFlashSale } from './FlashSaleModel'
import { ILesson } from './LessonModel'
import { ITag } from './TagModel'
import { IUser } from './UserModel'
const Schema = mongoose.Schema

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return value >= 0
        },
        message: 'Invalid price',
      },
      min: 0,
    },
    author: {
      type: String,
    },
    description: {
      type: String,
    },
    flashSale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'flashSale',
    },
    tags: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tag',
          minlength: 1,
        },
      ],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
      },
    ],
    images: {
      type: [
        {
          type: String,
        },
      ],
      minlength: 1,
    },
    joined: {
      type: Number,
      default: 0,
      min: 0,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
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
  {
    timestamps: true,
  }
)

// pre-save hook to generate slug from title
CourseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title)
  }

  next()
})

// create model from schema
const CourseModel = mongoose.models.course || mongoose.model('course', CourseSchema)
export default CourseModel

export interface ICourse {
  _id: string
  title: string
  oldPrice: number
  price: number
  author: string
  description: string
  flashSale: string | undefined | IFlashSale
  tags: string[] | ITag[]
  categories: string[] | ICategory[]
  images: string[]
  joined: number
  slug: string
  active: boolean
  likes: string[] | IUser[]
  createdAt: string
  updatedAt: string

  // sub
  chapters?: IChapter[]
  lessons: ILesson[]
}
