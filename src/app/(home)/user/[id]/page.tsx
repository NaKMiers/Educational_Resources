import Avatar from '@/components/Avatar'
import Divider from '@/components/Divider'
import GroupCourses from '@/components/GroupCourses'
import { IUser } from '@/models/UserModel'
import { getUsersApi } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaDiscourse } from 'react-icons/fa'

async function ProfilePage({ params: { id } }: { params: { id: string } }) {
  let user: IUser

  try {
    // get user profile
    const res = await getUsersApi(id)

    user = res.user
  } catch (err: any) {
    console.error(err)
    return notFound()
  }

  return (
    <div className='bg-opacity-75'>
      {/* Top */}
      <div className='flex flex-col sm:flex-row items-center justify-between gap-21 px-21 md:px-20 py-10 border-b-2 border-dark'>
        {/* Info */}
        <div className='font-body tracking-wider order-2 sm:order-1'>
          <h1 className='text-4xl font-bold'>
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user?.username}
          </h1>
          <p className='text-lg text-slate-500 font-semibold mt-1 break-words'>{user?.email}</p>

          <p className='flex items-center gap-1.5 group font-semibold mt-3'>
            <FaDiscourse size={18} className='text-slate-700 wiggle' />
            <span className='text-slate-600'>5 Course</span>
          </p>
          <p className='flex items-center gap-1.5 group font-semibold mt-1'>
            <FaDiscourse size={18} className='text-slate-700 wiggle' />
            <span className='text-slate-600'>162 Online Hours</span>
          </p>
          <p className='flex items-center gap-1.5 group font-semibold mt-1'>
            <FaDiscourse size={18} className='text-slate-700 wiggle' />
            <span className='text-slate-600'>49 Questions</span>
          </p>
          <p className='flex items-center gap-1.5 group font-semibold mt-1'>
            <FaDiscourse size={18} className='text-slate-700 wiggle' />
            <span className='text-slate-600'>99 Likes</span>
          </p>
        </div>

        {/* Avatar */}
        <div className='max-w-[200px] max-h-[200[px] w-full h-full flex-shrink-0 order-1 sm:order-2 '>
          <Avatar />
        </div>
      </div>

      {/* Center */}
      <div className='relative grid grid-cols-12 md:px-10 border-b-2 border-dark'>
        <div className='col-span-12 lg:col-span-8 px-8 py-21 order-2 lg:order-1'>
          <h2 className='font-bold text-2xl text-center text-slate-600'>Joined Courses</h2>

          {!!user.courses.length ? (
            <GroupCourses child='course-card' courses={user.courses} />
          ) : (
            <p className='text-center font-body tracking-wider italic mt-4'>
              You haven&apos;t joined any courses yet.{' '}
              <Link href='/courses' className='text-sky-500 underline underline-offset-2'>
                Explore new courses now.
              </Link>
            </p>
          )}

          <Divider size={16} />
        </div>

        <div className='col-span-12 lg:col-span-4 order-1 lg:order-2 lg:border-l-2 border-dark p-21'>
          <p className='sticky top-[80px] left-0 bg-slate-200 bg-opacity-80 font-semibold font-body tracking-wider p-4 rounded-lg shadow-lg'>
            {user?.bio}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className='relative px-8 md:px-12 py-21'>
        <h2 className='font-bold text-2xl text-center text-slate-600'>Questions</h2>

        <Divider size={4} />

        {!!user?.questions?.length ? (
          <GroupCourses
            className='md:px-20'
            child='question'
            childClassName='w-full sm:w-1/2 md:w-1/3 px-21/2'
            questions={user.questions}
          />
        ) : (
          <p className='text-center font-body tracking-wider italic'>
            You haven&apos;t asked any questions yet.{' '}
            <Link href='/question' className='text-sky-500 underline underline-offset-2'>
              Write down your mind now.
            </Link>
          </p>
        )}

        <Divider size={20} />
      </div>
    </div>
  )
}

export default ProfilePage
