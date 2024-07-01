import AddQuestionForm from '@/components/AddQuestionForm'
import { BackgroundBeams } from '@/components/BackgroundBeam'
import { Boxes } from '@/components/BackgroundBoxes'
import Divider from '@/components/Divider'
import Pagination from '@/components/Pagination'
import Question from '@/components/QuestionItem'
import { IQuestion } from '@/models/QuestionModel'
import { getQuestionPageApi } from '@/requests'
import { cn } from '@/utils/cn'
import { handleQuery } from '@/utils/handleQuery'

async function QuestionPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let questions: IQuestion[] = []
  let amount: number = 0
  let itemsPerPage: number = 8

  try {
    // get query
    const query = handleQuery(searchParams)

    const res = await getQuestionPageApi(query)

    questions = res.questions
    amount = res.amount
  } catch (err: any) {
    console.error(err)
  }

  return (
    <div className='relative flex px-21 mb-21'>
      {/* Questions */}
      <div className='flex-1 px-21 relative z-10'>
        <Divider size={8} />

        {/* Background Boxes */}
        <div className='h-96 px-21 relative w-full overflow-hidden bg-neutral-800 flex flex-col items-center justify-center rounded-lg'>
          <div className='absolute inset-0 w-full h-full bg-dark-0 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none' />

          <Boxes />
          <h1 className={cn('md:text-4xl text-center text-xl text-light relative z-20')}>
            Educational Resources. The Best Choice For Learning Anything.
          </h1>
          <p className='text-center mt-2 text-slate-500 relative z-20'>
            Developed by Anh Khoa, Gia Bao, Phuong Anh, Quoc Thang.
          </p>
        </div>

        <Divider size={8} />

        {/* Input */}
        <AddQuestionForm />

        <Divider size={12} />

        {/* Question List */}
        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-21'>
          {questions.map(question => (
            <Question question={question} key={question._id} />
          ))}
        </ul>

        <Divider size={25} />

        {/* Pagination */}
        <div className='flex items-center justify-center p-2'>
          <Pagination
            searchParams={searchParams}
            amount={amount}
            itemsPerPage={itemsPerPage}
            className='bg-white p-2 rounded-lg'
          />
        </div>
        <Divider size={32} />
      </div>
    </div>
  )
}

export default QuestionPage
