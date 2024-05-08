import mongoose from 'mongoose'
const Schema = mongoose.Schema

const FlashSaleSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['fixed-reduce', 'fixed', 'percentage'],
      default: 'fixed-reduce',
    },
    value: {
      type: String,
      required: true,
      default: '0',
    },
    begin: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    timeType: {
      type: String,
      enum: ['loop', 'once'],
      required: true,
    },
    duration: {
      type: Number,
      required: function (this: { type: string }) {
        return this.type === 'loop'
      },
      min: 0,
    },
    expire: {
      type: Date,
      required: function (this: { type: string }) {
        return this.type === 'once'
      },
    },
    courseQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
)

const FlashSaleModel = mongoose.models.flashSale || mongoose.model('flashSale', FlashSaleSchema)
export default FlashSaleModel

export interface IFlashSale {
  type: string
  value: string
  begin: Date
  timeType: string
  duration: number
  expire: Date
  courseQuantity: number
  createdAt: Date
  updatedAt: Date
}
