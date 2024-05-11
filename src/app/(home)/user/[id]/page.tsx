import Divider from '@/components/Divider'
import GroupCourses from '@/components/GroupCourses'
import { IUser } from '@/models/UserModel'
import { getUsersApi } from '@/requests'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FaDiscourse } from 'react-icons/fa'

async function ProfilePage({ params: { id } }: { params: { id: string } }) {
  let user: IUser

  try {
    // get user profile
    const res = await getUsersApi(id)
    console.log('res:', res)
    user = res.user
  } catch (err: any) {
    console.error(err)
    return notFound()
  }

  return (
    <div className='bg-opacity-75'>
      {/* Background */}
      <div className='fixed -z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-primary '>
        <Image src='/images/logo.png' width={300} height={300} alt='logo' />
      </div>

      {/* Top */}
      <div className='flex justify-between px-20 py-10 border-b-2 border-dark'>
        {/* Info */}
        <div className='font-body tracking-wider'>
          <h1 className='text-4xl font-bold'>
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user?.username}
          </h1>
          <p className='text-lg text-slate-500 font-semibold mt-1'>{user?.email}</p>

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
        <div className='rounded-full aspect-square border-2 border-white shadow-lg overflow-hidden'>
          <Image
            src={user?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
            width={200}
            height={200}
            alt='avatar'
          />
        </div>
      </div>

      {/* Center */}
      <div className='relative grid grid-cols-12 px-10 border-b-2 border-dark'>
        <div className='col-span-12 lg:col-span-8 px-8 py-21'>
          <h2 className='font-bold text-2xl text-center text-slate-600'>Joined Courses</h2>

          <GroupCourses
            child='course-card'
            courses={[...user.courses, ...user.courses, ...user.courses, ...user.courses]}
          />

          <Divider size={16} />
        </div>

        <div className='col-span-12 lg:col-span-4 border-l-2 border-dark p-21'>
          <p className='sticky top-[80px] left-0 bg-slate-200 bg-opacity-80 font-semibold font-body tracking-wider p-4 rounded-lg shadow-lg'>
            {/* {user?.bio} */}
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis veritatis ipsum quaerat
            rem facere sunt accusantium quibusdam voluptatum quo! Deleniti recusandae et possimus rerum
            quia quidem quo, nobis, facere porro quis magni, soluta autem. Officia voluptate modi, maxime
            dolore explicabo laborum vitae nostrum, natus iste quidem dignissimos inventore ipsa quod.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className='relative px-10 py-21'>
        <h2 className='font-bold text-2xl text-center text-slate-600'>Questions</h2>

        <Divider size={4} />

        <GroupCourses
          className='md:px-20'
          child='question'
          childClassName='w-full sm:w-1/2 md:w-1/3 px-21/2'
          courses={[...user.courses, ...user.courses, ...user.courses, ...user.courses]}
        />

        <Divider size={20} />
      </div>
    </div>
  )
}

export default ProfilePage
