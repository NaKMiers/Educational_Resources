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
    typeId: {
      type: Schema.Types.ObjectId,
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
  content: string
  createdAt: string
  updatedAt: string
}
