import mongoose from 'mongoose'
import { IUser } from './UserModel'
import { IVoucher } from './VoucherModel'
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
      required: true,
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
    receivedUser: {
      type: String,
    },
    voucherApplied: {
      type: Schema.Types.ObjectId,
      ref: 'voucher',
    },
    discount: {
      type: Number,
      default: 0,
    },
    item: {
      type: {},
    },
    status: {
      type: String,
      enum: ['pending', 'done', 'canceled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['momo', 'banking'],
    },
  },
  {
    timestamps: true,
  }
)

const OrderModel = mongoose.models.order || mongoose.model('order', OrderSchema)

export default OrderModel

export interface IOrder {
  _id: string
  code: string
  userId: string | IUser
  email: string
  total: number
  receivedUser?: string
  voucherApplied: string | IVoucher
  discount: number
  item: any
  status: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}
