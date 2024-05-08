import { connectDatabase } from '@/config/database'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User, Account, Voucher, Category, Tag, Order, Product
import '@/models/AccountModel'
import '@/models/CategoryModel'
import '@/models/OrderModel'
import '@/models/ProductModel'
import ProductModel from '@/models/ProductModel'
import '@/models/TagModel'
import '@/models/UserModel'
import '@/models/VoucherModel'
import { FullyProduct } from '../product/[slug]/route'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  console.log('- Get Full Data - ')

  try {
    // connect to database
    await connectDatabase()

    // // get all done orders
    // const orders = await OrderModel.find({ status: 'done' }).sort({ createdAt: -1 }).lean()

    // // ranks
    // const spentUsers: any[] = await rankCustomersByTotalSpent(orders)

    // data
    // const categories: ICategory[] = await CategoryModel.find().lean()

    return NextResponse.json(
      {
        // stats
        // revenueStat,
        // newOrderStat,
        // newAccountSoldStat,
        // newUserStat,
        // newUsedVoucherStat,
        // rank
        // rankCategories,
        // rankTags,
        // spentUsers,
        // data
        // orders,
        // categories,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
