import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ReportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
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
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
}
