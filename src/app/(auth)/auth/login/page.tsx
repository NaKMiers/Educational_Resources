'use client'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

function LoginPage() {
  // hooks
  const router = useRouter()

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  })

  // MARK: Login Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // start loading
      setIsLoading(true)

      try {
        // send request to server
        const res = await signIn('credentials', { ...data, redirect: false })

        if (res?.ok) {
          // show success message
          toast.success('Login successful!')

          // redirect to home page
          router.push('/')
        }

        if (res?.error) {
          // show error message
          toast.error(res.error)
          setError('usernameOrEmail', { type: 'manual' })
          setError('password', { type: 'manual' })
        }
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop loading state
        setIsLoading(false)
      }
    },
    [setError, router]
  )

  // keyboard event
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit(onSubmit)()
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleSubmit, onSubmit])

  return (
    <div className='h-screen w-full lg:px-[46px] lg:py-[52px] overflow-hidden'>
      <div className='relative flex justify-center h-full w-full bg-primary py-9 px-21 lg:rounded-[40px] shadow-lg overflow-hidden'>
        <div className='hidden lg:block absolute top-0 left-0 w-[60%]'>
          <Image
            className='w-full h-full object-contain object-left-top opacity-50'
            src='/images/vector-5.png'
            width={1000}
            height={1000}
            alt='shape-5'
          />
        </div>

        <div className='hidden lg:block absolute bottom-0 left-0 w-[60%]'>
          <Image
            className='w-full h-full object-contain object-left-bottom'
            src='/images/vector-6.png'
            width={1000}
            height={1000}
            alt='shape-6'
          />
        </div>

        <div className='hidden lg:block absolute z-20 left-[3vw] top-[20%] max-w-[34vw]'>
          <div className='hidden lg:block w-[25vw]'>
            <Image
              className='w-full h-full object-contain object-top'
              src='/images/focus_image.png'
              width={625}
              height={680}
              alt='vector-5'
            />
          </div>

          <p className='text-[#4F7575] left-[46px] font-semibold text-3xl top-[20%]'>
            EDUCATIONAL RESOURCES
          </p>
          <p className='text-[#3D3D3D] font-semibold text-3xl mt-5'>
            Walking with you on the path to success.
          </p>
        </div>

        <div className='lg:absolute top-1/2 lg:right-[50px] lg:-translate-y-1/2 px-[32px] py-2 max-w-[500px] w-full bg-white rounded-[28px] overflow-y-auto'>
          <div className='flex justify-center items-center gap-1'>
            <div className='w-[50px]'>
              <Image
                className='w-full h-full object-contain object-left'
                src='/images/logo.png'
                width={80}
                height={80}
                alt='logo'
              />
            </div>
            <span className='font-bold text-3xl text-orange-500'>ERE</span>
          </div>

          <Divider size={4} />

          <h1 className='font-semibold text-3xl text-center'>Login Account</h1>

          <Divider size={4} />

          <Input
            id='usernameOrEmail'
            label='Username/Email'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='text'
            labelBg='bg-white'
            className='min-w-[40%] mt-3'
            onFocus={() => clearErrors('usernameOrEmail')}
          />

          <Input
            id='password'
            label='Password'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='password'
            labelBg='bg-white'
            className='min-w-[40%] mt-6'
            onFocus={() => clearErrors('password')}
          />

          <Link
            href='/auth/forgot-password'
            className='block w-full text-right text-sm underline underline-offset-2 mt-2'>
            Forgot Password?
          </Link>

          <div className='flex items-center justify-center gap-3'>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`h-[42px] flex items-center justify-center border border-dark bg-secondary text-dark rounded-3xl px-5 mt-5 font-bold text-lg hover:bg-white common-transition ${
                isLoading ? 'bg-slate-200 pointer-events-none' : ''
              }`}>
              {isLoading ? (
                <FaCircleNotch
                  size={18}
                  className='text-slate-700 group-hover:text-dark common-transition animate-spin'
                />
              ) : (
                'Login'
              )}
            </button>
          </div>

          <Divider size={10} />

          <p className='font-semibold text-center'>
            Don&apos;t have an lesson yet?{' '}
            <Link href='/auth/register' className='underline underline-offset-2'>
              Create Now
            </Link>
          </p>

          <Divider size={6} />

          <div className='relative w-full h-px bg-black mt-2'>
            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-2 font-semibold'>
              Or
            </span>
          </div>

          <Divider size={6} />

          <div className='flex flex-wrap lg:flex-nowrap justify-center gap-x-6 gap-y-4'>
            <button className='flex items-center gap-2 group rounded-2xl border border-dark px-2.5 py-3'>
              <div className='aspect-square rounded-full wiggle flex-shrink-0'>
                <Image
                  className='w-full h-full object-cover'
                  src='/images/github-logo.png'
                  width={30}
                  height={30}
                  alt='github'
                />
              </div>
              <span className='font-semibold text-sm' onClick={() => signIn('github')}>
                Login with GitHub
              </span>
            </button>

            <button className='flex items-center gap-2 group rounded-2xl border border-dark px-2.5 py-3'>
              <div className='aspect-square rounded-full wiggle flex-shrink-0'>
                <Image
                  className='w-full h-full object-cover'
                  src='/images/google-logo.png'
                  width={30}
                  height={30}
                  alt='github'
                />
              </div>
              <span className='font-semibold text-sm' onClick={() => signIn('google')}>
                Login with Google
              </span>
            </button>
          </div>

          <Divider size={8} />
        </div>
      </div>
    </div>
  )
}
export default LoginPage
