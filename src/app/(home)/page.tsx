import Banner from '@/components/Banner'
import { ICourse } from '@/models/CourseModel'
import { getHomeApi } from '@/requests'

async function Home() {
  let courses: ICourse[] = []

  try {
    const data = await getHomeApi()

    courses = data.courses
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='min-h-screen'>
      <Banner courses={courses} />
    </div>
  )
}

export default Home
