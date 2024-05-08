'use client'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

function LoginPage() {
  const handleLogin = async () => {
    try {
      // send request to server
      const res = await signIn('credentials', {
        usernameOrEmail: 'diwas118151@gmail.com',
        password: 'Asdasd1',
        redirect: false,
      })

      if (res?.ok) {
        // show success message
        toast.success('Đăng nhập thành công')
      }

      if (res?.error) {
        // show error message
        toast.error(res.error)
      }
    } catch (err: any) {
      toast.error(err.message)
      console.log(err)
    }
  }

  return (
    <div className='h-screen w-full flex justify-center items-center gap-5'>
      <button className='p-3 rounded-lg bg-primary' onClick={handleLogin}>
        Login
      </button>
      <button className='p-3 rounded-lg bg-primary' onClick={() => signIn('google')}>
        Google
      </button>
      <button className='p-3 rounded-lg bg-primary' onClick={() => signIn('github')}>
        GitHub
      </button>
    </div>
  )
}

export default LoginPage
