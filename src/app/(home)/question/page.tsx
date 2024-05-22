import AddQuestionForm from '@/components/AddQuestionForm'
import Divider from '@/components/Divider'
import Pagination from '@/components/Pagination'
import Question from '@/components/QuestionItem'
import { IQuestion } from '@/models/QuestionModel'
import { getQuestionPageApi } from '@/requests'
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
    <div className='flex px-21 mb-21'>
      {/* Questions */}
      <div className='flex-1 px-21'>
        <Divider size={8} />

        {/* Input */}
        <AddQuestionForm />

        <Divider size={12} />

        {/* Question List */}
        <ul className='grid grid-cols-1 md:grid-cols-2 gap-21'>
          {questions.map(question => (
            <Question question={question} key={question._id} />
          ))}
        </ul>

        <Divider size={25} />

        {/* Pagination */}
        <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemsPerPage} />
      </div>

      {/* ... */}
      {/* <div className='max-w-[350px] w-full'></div> */}
    </div>
  )
}

export default QuestionPage
