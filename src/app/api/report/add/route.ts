// Models: Report

import { connectDatabase } from '@/config/database'
import ReportModel from '@/models/ReportModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /report/add
export async function POST(req: NextRequest) {
  console.log('- Add Report - ')

  try {
    // connect to database
    await connectDatabase()

    // get user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })
    const userId = token?._id

    // check user id
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 404 })
    }

    // get data from request
    const { type, content, link } = await req.json()

    // create report
    const report = new ReportModel({
      userId,
      type,
      content,
      link,
    })

    await report.save()

    // return response
    return NextResponse.json({ message: 'Report successfully' }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
