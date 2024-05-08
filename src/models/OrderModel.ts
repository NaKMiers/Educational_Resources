import mongoose from 'mongoose'
const Schema = mongoose.Schema

const OrderSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    email: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    voucherApplied: {
      type: Schema.Types.ObjectId,
      ref: 'voucher',
    },
    discount: {
      type: Number,
      default: 0,
    },
    items: {
      type: [
        {
          type: {},
        },
      ],
      minlength: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'done', 'canceled'],
      default: 'pending',
    },
    paymentMethod: {
      enum: ['momo', 'banking'],
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const OrderModel = mongoose.models.order || mongoose.model('order', OrderSchema)

export default OrderModel

export interface IOrder {
  code: string
  userId: string
  email: string
  total: number
  voucherApplied: string
  discount: number
  items: any[]
  status: string
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}
