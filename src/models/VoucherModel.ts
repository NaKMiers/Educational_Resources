import mongoose from 'mongoose'
import { IUser } from './UserModel'
const Schema = mongoose.Schema

const VoucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      maxlength: 10,
      minlength: 5,
    },
    desc: {
      type: String,
    },
    begin: {
      type: Date,
      required: true,
    },
    expire: {
      type: Date,
    },
    minTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxReduce: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ['fixed-reduce', 'fixed', 'percentage'],
      default: 'fixed-reduce',
    },
    timesLeft: {
      type: Number,
      default: 1,
      min: 0,
    },
    value: {
      type: String,
      required: true,
      default: '0',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    usedUsers: [
      {
        type: String, // email
        required: true,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    accumulated: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// code uppercase
VoucherSchema.pre('save', function (next) {
  this.code = this.code.toUpperCase()
  next()
})

const VoucherModel = mongoose.models.voucher || mongoose.model('voucher', VoucherSchema)
export default VoucherModel

export interface IVoucher {
  _id: string
  code: string
  desc: string
  begin: string
  expire?: string
  minTotal: number
  maxReduce: number
  type: 'fixed-reduce' | 'fixed' | 'percentage'
  timesLeft?: number
  value: string
  owner: string | IUser
  usedUsers: string[]
  active: boolean
  accumulated: number
  createdAt: string
  updatedAt: string
}
