import Image from 'next/image'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { FaCommentAlt, FaRegCommentDots, FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa'

function Question() {
  return (
    <div className='rounded-2xl shadow-lg bg-white bg-opacity-80'>
      {/* Top */}
      <div className='flex gap-3 p-4 border-b-2 border-slate-300'>
        <div className='flex-shrink-0 w-[50px] h-[50px] rounded-full aspect-square overflow-hidden shadow-lg'>
          <Image
            className='w-full h-full object-cover'
            src='/images/logo.png'
            width={75}
            height={75}
            alt='avatar'
          />
        </div>
        <div className=''>
          <p className='text-lg font-bold -mt-1.5'>Anh Khoa</p>
          <p className='text-slate-500 text-sm font-semibold'>14 minutes ago</p>
        </div>
      </div>

      {/* Center */}
      <div className='px-5 py-6 font-body tracking-wider border-b-2 border-slate-300'>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta, totam?
      </div>

      {/* Bottom */}
      <div className='flex h-[50px]'>
        <div className='flex justify-center items-center w-full border-r-2 border-slate-300'>
          <button className='flex items-center justify-center group'>
            <span className='mr-1.5 font-semibold'>15</span>{' '}
            <FaRegThumbsUp size={18} className='group-hover:text-rose-500 common-transition' />
            {/* <FaThumbsUp size={18} className='group-hover:text-rose-500 common-transition' /> */}
          </button>
        </div>

        <div className='flex justify-center items-center w-full'>
          <button className='flex items-center justify-center'>
            <span className='mr-1.5 font-semibold'>99</span> <FaRegCommentDots size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Question
