import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import Pagination from '@/components/Pagination'
import { ICourse } from '@/models/CourseModel'
import { getFlashSalePageApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import Link from 'next/link'

async function FlashSalePage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let courses: ICourse[] = []
  let query: string = ''
  let amount: number = 0
  let itemPerPage = 6

  try {
    // get query
    query = handleQuery(searchParams)

    // cache: no-store for filter
    const data = await getFlashSalePageApi(query)

    // destructure
    courses = data.courses
    amount = data.amount
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='px-21'>
      <Divider size={12} />

      {/* Heading */}
      <h1 className='text-4xl font-semibold px-21 text-center'>Flash Sale Now</h1>

      <Divider size={8} />

      {/* MAIN List */}
      {!!courses.length ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-21'>
          {courses.map(course => (
            <CourseCard course={course} key={course._id} />
          ))}
        </div>
      ) : (
        <div className='font-body tracking-wider text-center'>
          <p className='italic'>
            There are not any courses on flash sale at the moment. Please come back later.
          </p>
          <Link
            href='/'
            className='text-sky-500 underline underline-offset-2 hover:text-sky-700 trans-200'>
            Return Home
          </Link>
        </div>
      )}

      <Divider size={8} />

      {/* Pagination */}
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      <Divider size={20} />
    </div>
  )
}

export default FlashSalePage
