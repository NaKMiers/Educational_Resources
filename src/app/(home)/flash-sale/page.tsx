import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import Meta from '@/components/Meta'
import Pagination from '@/components/Pagination'
import { ICourse } from '@/models/CourseModel'
import { getFlashSaleApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'

async function FlashSalePage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let courses: ICourse[] = []
  let query: string = ''
  let amount: number = 0
  let itemPerPage = 6

  try {
    // get query
    query = handleQuery(searchParams)

    // cache: no-store for filter
    const data = await getFlashSaleApi(query)

    console.log('data: ', data)

    // destructure
    courses = data.courses
    amount = data.amount
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='px-21'>
      <Divider size={6} />

      {/* Heading */}
      <h1 className='text-4xl font-semibold px-21'>Flash Sales</h1>

      {/* Filter & Search Bar */}
      <div className='flex justify-between'>
        {/* Filter */}
        {/* <Meta searchParams={searchParams} tags={tags} categories={categories} chops={chops} /> */}
      </div>

      <Divider size={5} />

      {/* MAIN List */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-21'>
        {courses.map(course => (
          <CourseCard course={course} key={course._id} />
        ))}
      </div>

      <Divider size={8} />

      {/* Pagination */}
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      <Divider size={20} />
    </div>
  )
}

export default FlashSalePage
