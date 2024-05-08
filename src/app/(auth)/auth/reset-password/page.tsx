'use client'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import { commonEmailMistakes } from '@/constants/mistakes'
import { resetPassword } from '@/requests'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

function ResetPasswordPage() {
  // hooks
  const router = useRouter()
  const queryParams = useSearchParams()

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
      newPassword: '',
      reNewPassword: '',
    },
  })

  useEffect(() => {
    // MARK: Check if token is not provided
    if (!queryParams.get('token')) {
      toast.error('Không có token')
      router.push('/auth/login')
    }
  }, [queryParams, router])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(data.newPassword)) {
        setError('newPassword', {
          type: 'manual',
          message:
            'Mật khẩu mới phải có ít nhất 6 kí tự và bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số',
        })
        isValid = false
      }

      // check if new password and re-new password are match
      if (data.newPassword !== data.reNewPassword) {
        setError('reNewPassword', { type: 'manual', message: 'Mật khẩu không khớp' }) // add this line
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Reset Password Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      console.log('data')
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setIsLoading(true)

      try {
        // get email and token from query
        const token = queryParams.get('token')

        // send request to server
        const { message } = await resetPassword(token!, data.newPassword)

        // show success message
        toast.success(message)

        // redirect to login page
        router.push('/auth/login')
      } catch (err: any) {
        // show error message
        toast.error(err.message)
        console.log(err)
      } finally {
        // reset loading state
        setIsLoading(false)
      }
    },
    [handleValidate, router, queryParams]
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
    <div className='relative min-h-screen w-full'>
      <Image
        className='absolute z-30 top-0 left-0'
        src='/images/logo.png'
        width={70}
        height={70}
        alt='logo'
      />

      <div className='hidden md:block absolute top-[0%] left-0 w-[32vw]'>
        <Image
          className='w-full h-full object-contain object-left'
          src='/images/vector-1.png'
          width={600}
          height={600}
          alt='shape-1'
        />
      </div>

      <div className='hidden md:block absolute bottom-[0%] left-[10%] w-[35vw]'>
        <Image
          className='w-full h-full object-contain object-bottom'
          src='/images/vector-2.png'
          width={600}
          height={600}
          alt='shape-2'
        />
      </div>

      <div className='hidden md:block absolute top-[0%] left-[0%] w-[54vw]'>
        <Image
          className='w-full h-full object-contain object-top'
          src='/images/vector-3.png'
          width={625}
          height={680}
          alt='shape-3'
        />
      </div>

      <div className='hidden md:block absolute bottom-[0%] left-[0%] w-[54vw]'>
        <Image
          className='w-full h-full object-contain object-left'
          src='/images/vector-4.png'
          width={600}
          height={600}
          alt='shape-3'
        />
      </div>

      <div className='hidden md:block absolute z-20 top-[15.5%] left-0 pl-[40px] leading-10 text-[28px] max-w-[33%]'>
        Let&apos;s develop knowledge together anytime, anywhere.
      </div>

      <div className='hidden md:block absolute z-20 left-[3vw] bottom-[10%] w-[38vw] lg:w-[30vw]'>
        <Image
          className='w-full h-full object-contain object-top'
          src='/images/focus_image.png'
          width={625}
          height={680}
          alt='vector-5'
        />
      </div>

      <div className='flex justify-center px-[10%] pt-24 absolute z-10 top-0 right-0 bottom-0 h-screen w-full md:w-2/3 bg-primary md:rounded-l-[40px] md:shadow-lg md:border-l-2 md:border-gray-500 overflow-y-scroll'>
        <div className='flex flex-col gap-6 w-full'>
          <h1 className='font-semibold text-3xl'>Reset Password</h1>

          <Divider size={4} />
          <Input
            id='newPassword'
            label='New Password'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='text'
            className='min-w-[40%]'
            onFocus={() => clearErrors('newPassword')}
          />

          <Input
            id='reNewPassword'
            label='New Password Again'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='text'
            className='min-w-[40%]'
            onFocus={() => clearErrors('password')}
          />

          <Link href='/auth/login' className='text-right -mt-4 underline underline-offset-2'>
            Back to login?
          </Link>

          <div className='flex items-center justify-end gap-3'>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className={`border border-dark text-dark rounded-3xl px-5 py-2.5 font-bold text-lg hover:bg-white common-transition ${
                isLoading ? 'bg-slate-200 pointer-events-none' : ''
              }`}>
              {isLoading ? (
                <FaCircleNotch
                  size={18}
                  className='text-white group-hover:text-dark common-transition animate-spin'
                />
              ) : (
                'Reset'
              )}
            </button>
          </div>

          <Divider size={4} />

          <p className='font-semibold text-center'>
            Don&apos;t have an account yet?{' '}
            <Link href='/auth/register' className='underline'>
              Create Now
            </Link>
          </p>
          <div className='relative w-full h-px bg-black mt-2'>
            <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary px-3 py-2 font-semibold'>
              Or
            </span>
          </div>

          <div className='flex flex-wrap md:flex-nowrap justify-center gap-x-6 gap-y-4'>
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
              <span className='font-semibold text-sm'>Login with GitHub</span>
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
              <span className='font-semibold text-sm'>Login with Google</span>
            </button>
          </div>

          <Divider size={20} />
        </div>
      </div>
    </div>
  )
}
export default ResetPasswordPage
