import AddQuestionForm from '@/components/AddQuestionForm'
import Background from '@/components/Background'
import Divider from '@/components/Divider'
import Pagination from '@/components/Pagination'
import Question from '@/components/Question'
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
    console.log('query:', query)

    const res = await getQuestionPageApi(query)

    questions = res.questions
    amount = res.amount
  } catch (err: any) {
    console.error(err)
  }

  return (
    <div className='flex px-21'>
      {/* Background */}
      <Background />

      {/* Questions */}
      <div className='flex-1 border-r-2 border-dark p-21'>
        {/* Input */}
        <AddQuestionForm />

        <Divider size={20} />

        {/* Question List */}
        <ul className='flex flex-col gap-8'>
          {questions.map(question => (
            <Question question={question} key={question._id} />
          ))}
        </ul>

        <Divider size={25} />

        {/* Pagination */}
        <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemsPerPage} />
      </div>

      {/* ... */}
      <div className='max-w-[350px] w-full'></div>
    </div>
  )
}

export default QuestionPage
