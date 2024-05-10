import Divider from '@/components/Divider'
import GroupCourses from '@/components/GroupProducts'
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
    <div className='bg-primary bg-opacity-75'>
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

      {/* Bottom */}
      <div className='relative grid grid-cols-12 p-10'>
        <div className='col-span-12 lg:col-span-8 px-21'>
          <GroupCourses courses={user.courses} />

          <Divider size={5} />
        </div>

        <div className='col-span-12 lg:col-span-4 border-l-2 border-dark px-21'>
          <p className='sticky top-[80px] left-0 bg-slate-200 bg-opacity-80 font-semibold font-body tracking-wider p-4 rounded-lg shadow-lg'>
            {/* {user?.bio} */}
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis veritatis ipsum quaerat
            rem facere sunt accusantium quibusdam voluptatum quo! Deleniti recusandae et possimus rerum
            quia quidem quo, nobis, facere porro quis magni, soluta autem. Officia voluptate modi, maxime
            dolore explicabo laborum vitae nostrum, natus iste quidem dignissimos inventore ipsa quod.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
