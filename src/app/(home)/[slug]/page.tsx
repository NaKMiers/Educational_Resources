import BuyNowButton from '@/components/BuyNowButton'
import Chapter from '@/components/Chapter'
import Divider from '@/components/Divider'
import Price from '@/components/Price'
import { ICategory } from '@/models/CategoryModel'
import { IChapter } from '@/models/ChapterModel'
import { IComment } from '@/models/CommentModel'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { getCoursePageApi } from '@/requests'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Course',
}

async function CoursePage({ params: { slug } }: { params: { slug: string } }) {
  // Data
  let course: ICourse | null = null
  let chapters: IChapter[] = []
  let comments: IComment[] = []

  // MARK: Get Data
  try {
    // revalidate every 1 minute
    const data = await getCoursePageApi(slug)

    course = data.course
    chapters = data.chapters
    comments = data.comments
  } catch (err: any) {
    return notFound()
  }

  return (
    <div className='max-w-1200 mx-auto pt-21 px-21'>
      {/* Introduction */}
      <div className='bg-slate-200 p-21 grid grid-cols-2 gap-21 items-start rounded-lg shadow-lg'>
        <div className='col-span-2 lg:col-span-1'>
          {/* Thumbnails */}
          <div className='relative flex justify-center items-center rounded-lg shadow-md overflow-hidden'>
            <div className='flex items-center w-full overflow-x-scroll snap-x snap-mandatory no-scrollbar'>
              {course?.images.map((src, index) => (
                <div className='aspect-video w-full flex-shrink-0 snap-start' key={index}>
                  <Image
                    key={index}
                    className='w-full h-full object-cover'
                    src={src}
                    height={800}
                    width={800}
                    alt='thumbnail'
                  />
                </div>
              ))}
            </div>
          </div>

          <Divider size={5} />

          <Price
            price={course?.price || 0}
            oldPrice={course?.oldPrice || 0}
            flashSale={course?.flashSale as IFlashSale}
          />

          <Divider size={5} />

          {/* Buy Now */}
          {course && <BuyNowButton course={course} className='w-full' />}
        </div>

        {/* Infomation */}
        <div className='col-span-2 lg:col-span-1 border-t-2 lg:border-t-0 lg:border-l-2 border-dark pt-21 lg:pt-0 px-21'>
          <p className='font-body tracking-wide text-center lg:text-start'>{course?.description}</p>

          <Divider size={3} border />

          <div className='flex flex-wrap justify-evenly'>
            <div className='h-[50px] flex justify-center items-center px-4 bg-white rounded-lg shadow-lg font-semibold'>
              {course?.joined} Students
            </div>

            <div className='h-[50px] flex justify-center items-center px-4 bg-white rounded-lg shadow-lg font-semibold'>
              {chapters.reduce((acc, chapter) => acc + (chapter.lessons?.length || 0), 0)} Lessons
            </div>

            <div className='h-[50px] flex justify-center items-center px-4 bg-white rounded-lg shadow-lg font-semibold'>
              {comments.length} comments
            </div>
          </div>
        </div>
      </div>

      <Divider size={20} />

      {/* Lessons */}
      {course && !!chapters.length && (
        <div className='grid grid-cols-12 gap-21'>
          {/* Lessons */}
          <div className='col-span-12 lg:col-span-8 order-2 lg:order-1'>
            <h1 className='font-semibold text-3xl'>Lessons</h1>

            <Divider size={3} />

            <ul className='flex flex-col gap-2'>
              {chapters.map(chapter => (
                <Chapter chapter={chapter} courseId={course._id} key={chapter._id} />
              ))}
            </ul>
          </div>

          {/* Detail */}
          <div className='col-span-12 lg:col-span-4 order-1 lg:order-2'>
            <div className='h-full p-3 rounded-lg bg-slate-200 shadow-lg'>
              <h1 className='font-semibold text-3xl'>Detail</h1>

              <Divider size={3} />

              <div className='flex flex-col gap-2'>
                {/* Categories */}
                <p
                  className='flex flex-wrap items-center gap-1 text-dark text-[18px] mr-2 leading-4 font-body tracking-wide'
                  title={course.title}>
                  <span>Categories: </span>
                  {(course.categories as ICategory[]).map(category => (
                    <Link
                      href={`/tag?tag=${category.slug}`}
                      className={`shadow-md text-xs ${
                        category.title ? 'bg-yellow-300 text-dark' : 'bg-slate-200 text-slate-400'
                      } px-2 py-px select-none rounded-md font-body mr-1`}
                      key={category._id}>
                      {category.title || 'empty'}
                    </Link>
                  ))}
                </p>

                <Divider size={2} />

                {/* Tags */}
                <p
                  className='flex flex-wrap items-center gap-1 text-dark text-[18px] mr-2 leading-4 font-body tracking-wide'
                  title={course.title}>
                  <span>Tags: </span>
                  {(course.tags as ICategory[]).map(tag => (
                    <Link
                      href={`/tag?tag=${tag.slug}`}
                      className={`shadow-md text-xs ${
                        tag.title ? 'bg-sky-300 text-dark' : 'bg-slate-200 text-slate-400'
                      } px-2 py-px select-none rounded-md font-body mr-1`}
                      key={tag._id}>
                      {tag.title || 'empty'}
                    </Link>
                  ))}
                </p>

                <Divider size={2} />

                {/* Total Time */}
                <p
                  className='flex flex-wrap items-center gap-1 text-dark text-[18px] mr-2 leading-4 font-body tracking-wide'
                  title={course.title}>
                  <span>Total Time: </span>
                  <span>
                    {Math.round(
                      chapters.reduce(
                        (acc, chapter) =>
                          acc +
                          (chapter.lessons?.reduce((total, lesson) => total + lesson.duration, 0) || 0),
                        0
                      ) / 60
                    )}{' '}
                    minutes
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Divider size={28} />
    </div>
  )
}

export default CoursePage
