import mongoose from 'mongoose'
import { IUser } from './UserModel'
const Schema = mongoose.Schema

const ReportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    type: {
      type: String,
      enum: ['question', 'comment', 'lesson', 'course'],
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const ReportModel = mongoose.models.report || mongoose.model('report', ReportSchema)
export default ReportModel

export interface IReport {
  _id: string
  userId: string | IUser
  type: string
  link: string
  content: string
  createdAt: Date
  updatedAt: Date
}
