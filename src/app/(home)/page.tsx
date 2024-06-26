import Banner from '@/components/Banner'
import BestSeller from '@/components/BestSeller'
import Divider from '@/components/Divider'
import Features from '@/components/Features'
import GroupCourses from '@/components/GroupCourses'
import Heading from '@/components/Heading'
import { ICourse } from '@/models/CourseModel'
import { IQuestion } from '@/models/QuestionModel'
import { getHomeApi } from '@/requests'

async function Home() {
  let courses: ICourse[] = []
  let bestSellers: ICourse[] = []
  let questions: IQuestion[] = []

  try {
    const data = await getHomeApi()

    courses = data.courses
    bestSellers = data.bestSellers
    questions = data.questions
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='min-h-screen'>
      {/* Banner */}
      <Banner courses={courses} />

      <Divider size={32} />

      {/* Best Seller */}
      <BestSeller courses={bestSellers} />

      <Divider size={32} />

      {/* Features */}
      <Features />

      <Divider size={32} />

      {/* Questions */}
      <div className='max-w-1200 mx-auto'>
        <Heading title='Questions' space />
      </div>
      <Divider size={8} />
      <div className='relative px-8 md:px-12 py-21'>
        <GroupCourses
          className='md:px-20'
          child='question'
          childClassName='w-full sm:w-1/2 lg:w-1/3 px-21/2'
          questions={questions}
        />

        <Divider size={20} />
      </div>

      <Divider size={32} />
    </div>
  )
}

export default Home
