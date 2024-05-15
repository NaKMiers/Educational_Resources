import Chapter from '@/components/Chapter'
import Divider from '@/components/Divider'
import Link from 'next/link'
import { FaChevronCircleLeft, FaChevronCircleRight, FaQuestion } from 'react-icons/fa'
import { IoChevronBackCircleOutline } from 'react-icons/io5'

function LessonPage() {
  return (
    <div className='grid grid-cols-12 min-h-screen'>
      {/* Left - Source */}
      <div className='flex flex-col relative col-span-12 md:col-span-9'>
        <Divider size={5} />

        <h2 className='flex items-center gap-2 font-semibold text-3xl px-21'>
          <Link href='/'>
            <IoChevronBackCircleOutline size={32} className='wiggle' />
          </Link>
          <span>My Course</span>
        </h2>

        <Divider size={4} />

        <div className='px-3'>
          <div className='aspect-video w-full rounded-lg shadow-lg overflow-hidden'>
            <iframe
              className='w-full h-full object-contain'
              src='https://www.youtube.com/embed/0FH9cgRhQ-k'
              title='The Largest Black Hole in the Universe - Size Comparison'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen></iframe>
          </div>
        </div>

        <Divider size={4} />

        <h1
          className='text-ellipsis line-clamp-2 w-full text-4xl font-body tracking-wider px-3'
          title=''>
          The Largest Black Hole In The Univers
        </h1>

        {/* Description */}
        <div></div>

        {/* Question */}
        <Link
          href='/question'
          className='absolute bottom-[62px] right-2 px-2 py-1 bg-slate-200  flex items-center rounded-lg hover:bg-dark-100 hover:text-white common-transition shadow-lg'>
          <span className='font-semibold text-lg'>Ask Question </span>
          <FaQuestion size={18} />
        </Link>

        <div className='flex flex-1 items-end pt-9'>
          <div className='py-2 w-full bg-slate-800 flex items-center justify-center gap-21'>
            <Link
              href='/'
              className='flex items-center gap-2 rounded-lg px-2 py-1 bg-slate-200 border-2 border-dark hover:bg-white common-transition'>
              <FaChevronCircleLeft size={20} />
              <span className='text-xl'>Previous</span>
            </Link>
            <Link
              href='/'
              className='flex items-center gap-2 rounded-lg px-2 py-1 bg-slate-200 border-2 border-dark hover:bg-white common-transition'>
              <span className='text-xl'>Next</span>
              <FaChevronCircleRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Right - Lessons */}
      <div className='col-span-12 md:col-span-3 border-l-2 border-dark pl-3'>
        <Divider size={4} />

        <div className='border border-dark rounded-lg shaodow-lg bg-white text-2xl font-semibold h-[40px] flex items-center justify-center'>
          All Lessons
        </div>

        <Divider size={2} />

        <ul className='flex flex-col gap-2'>
          {Array.from({ length: 10 }).map((item, index) => (
            <Chapter key={index} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LessonPage
