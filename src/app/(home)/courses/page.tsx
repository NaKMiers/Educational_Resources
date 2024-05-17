import CourseCard from '@/components/CourseCard'
import Divider from '@/components/Divider'
import Meta from '@/components/Meta'
import Pagination from '@/components/Pagination'
import { ICategory } from '@/models/CategoryModel'
import { ICourse } from '@/models/CourseModel'
import { ITag } from '@/models/TagModel'
import { getCoursesApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'

async function CoursesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let courses: ICourse[] = []
  let tags: ITag[] = []
  let categories: ICategory[] = []
  let query: string = ''
  let amount: number = 0
  let chops: { [key: string]: number } | null = null
  let itemPerPage = 8

  try {
    // get query
    query = handleQuery(searchParams)

    // cache: no-store for filter
    const data = await getCoursesApi(query)

    // destructure
    courses = data.courses
    categories = data.cates
    tags = data.tgs
    amount = data.amount
    chops = data.chops
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='px-21'>
      <Divider size={6} />

      {/* Heading */}
      <h1 className='text-4xl font-semibold px-21'>Courses</h1>

      {/* Filter & Search Bar */}
      <div className='flex justify-between'>
        {/* Filter */}
        <Meta searchParams={searchParams} type='ctg' items={categories} chops={chops} />
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

export default CoursesPage
