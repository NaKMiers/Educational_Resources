'use client'

import Divider from '@/components/Divider'
import Input from '@/components/Input'
import { admins } from '@/constants'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICourse } from '@/models/CourseModel'
import { IFlashSale } from '@/models/FlashSaleModel'
import { IVoucher } from '@/models/VoucherModel'
import { applyVoucherApi, createOrderApi, generateOrderCodeApi, getCoursePageApi } from '@/requests'
import { applyFlashSalePrice, calcPercentage, formatPrice } from '@/utils/number'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import { notFound, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'
import { IoIosHelpCircle } from 'react-icons/io'
import { MdOutlinePayments } from 'react-icons/md'
import { RiCoupon2Fill, RiDonutChartFill } from 'react-icons/ri'

function CheckoutPage({ params: { slug } }: { params: { slug: string } }) {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: session, update } = useSession()

  // states
  const [curUser, setCurUser] = useState<any>(session?.user || {})
  const [course, setCourse] = useState<ICourse | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'banking'>('momo')
  const [loading, setLoading] = useState<boolean>(false)

  const [isShowVoucher, setIsShowVoucher] = useState<boolean>(false)
  const [voucher, setVoucher] = useState<IVoucher | null>(null)
  const [voucherMessage, setVoucherMessage] = useState<string>('')
  const [applyingVoucher, setApplyingVoucher] = useState<boolean>(false)

  const [subTotal, setSubTotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [code, setCode] = useState<string>('')

  // values
  const admin = admins[(process.env.NEXT_PUBLIC_ADMIN! as keyof typeof admins) || 'KHOA']

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      paymentMethod: 'momo',
    },
  })

  // MARK: Side Effects
  // update user session
  useEffect(() => {
    const getUser = async () => {
      const session = await getSession()
      setCurUser(session?.user)
    }

    if (!curUser?._id) {
      getUser()
    }
  }, [update, curUser])

  // get course
  useEffect(() => {
    const getCourse = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        // revalidate every 1 minute
        const { course } = await getCoursePageApi(slug)
        setCourse(course)
      } catch (err: any) {
        return notFound()
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    getCourse()
  }, [slug, dispatch])

  // get order code
  useEffect(() => {
    const getCode = async () => {
      try {
        const { code } = await generateOrderCodeApi()
        setCode(code)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getCode()
  }, [])

  // auto calc total, discount, subTotal
  useEffect(() => {
    if (!course) return

    const subTotal = applyFlashSalePrice(course?.flashSale as IFlashSale, course.price)
    setSubTotal(subTotal)

    let finalTotal = subTotal
    let discount = 0
    if (voucher) {
      if (voucher.type === 'fixed-reduce') {
        discount = +voucher.value
        finalTotal = subTotal + discount
      } else if (voucher.type === 'fixed') {
        discount = +voucher.value
        finalTotal = discount
      } else if (voucher.type === 'percentage') {
        discount = +calcPercentage(voucher.value, subTotal)
        finalTotal = subTotal + discount
      }
    }
    setDiscount(discount)
    setTotal(finalTotal)
  }, [course, voucher])

  // send request to server to check voucher
  const handleApplyVoucher: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // check user
      if (!curUser?._id) {
        toast.error('User not found!')
        return
      }

      // start applying
      setApplyingVoucher(true)

      try {
        // send request to server
        const { voucher, message } = await applyVoucherApi(data.code, curUser?.email, subTotal)

        // set voucher to state
        setVoucher(voucher)
        setVoucherMessage(message)

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        const { message } = err
        toast.error(message)
        setVoucherMessage(message)
      } finally {
        // stop applying
        setApplyingVoucher(false)
      }
    },
    [subTotal, curUser]
  )

  // handle copy
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied: ' + text)
  }, [])

  // MARK: Buy
  const handleCheckout = useCallback(async () => {
    if (!curUser?._id) {
      return toast.error('User not found!')
    }

    // start page loading
    dispatch(setPageLoading(true))

    try {
      // send request to server to create order
      const { message } = await createOrderApi(
        code,
        curUser.email,
        total,
        voucher?._id,
        discount,
        course,
        paymentMethod
      )

      // notify success
      toast.success(message)

      // move to my course
      router.push('/my-courses')
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)

      // stop page loading
      dispatch(setPageLoading(false))
    }
  }, [
    dispatch,
    router,
    code,
    curUser?._id,
    curUser.email,
    discount,
    ,
    total,
    voucher,
    course,
    paymentMethod,
  ])

  return (
    <div className='max-w-1200 mx-auto p-21'>
      <div className='grid grid-cols-12 gap-21'>
        {/* MARK: Payment Method */}
        <div className='col-span-12 lg:col-span-7 order-2 lg:order-1'>
          <div className='rounded-lg shadow-lg border-2 border-sky-400 px-21 md:px-10'>
            <Divider size={12} />

            <h1 className='font-semibold text-3xl'>Payment Method</h1>
            <Divider size={6} />

            {/* Payment Method */}
            <div>
              <div className={`flex`}>
                <span
                  className={`inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 ${
                    errors.paymentMethod
                      ? 'border-rose-400 bg-rose-100'
                      : 'border-slate-200 bg-slate-100'
                  }`}>
                  <MdOutlinePayments size={19} className='text-secondary' />
                </span>
                <div
                  className={`relative w-full border-[2px] border-l-0 bg-white rounded-tr-lg rounded-br-lg ${
                    errors.paymentMethod ? 'border-rose-400' : 'border-slate-200'
                  }`}>
                  <select
                    id='paymentMethod'
                    className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
                    disabled={loading}
                    required
                    {...register('paymentMethod', { required: true })}
                    onChange={e => setPaymentMethod(e.target.value as 'momo' | 'banking')}>
                    <option value='momo' className='font-semibold text-rose-800'>
                      MOMO
                    </option>
                    <option value='banking' className='font-semibold text-green-600'>
                      BANKING
                    </option>
                  </select>

                  {/* label */}
                  <label
                    htmlFor='type'
                    className={`absolute rounded-md text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer ${
                      errors.paymentMethod ? 'text-rose-400' : 'text-dark'
                    }`}>
                    Payment Method
                  </label>
                </div>
              </div>
              {errors.type?.message && (
                <span className='text-sm text-rose-400'>{errors.type?.message?.toString()}</span>
              )}
            </div>

            <Divider size={2} />

            <div className='col-span-1 lg:col-span-7 order-2 lg:order-first'>
              <p className='text-secondary font-semibold mb-2'>
                * Transfer to account below with content:{' '}
              </p>

              {paymentMethod === 'momo' ? (
                <a href='https://me.momo.vn/anphashop'>
                  Click here for quick transfer:{' '}
                  <span className='text-[#a1396c] underline'>Link to MOMO</span>
                </a>
              ) : (
                <a
                  href={`https://dl.vietqr.io/pay?app=vcb&ba=${admin.banking.account}@vcb&am=${total}&tn=${code}`}>
                  Ấn vào link sau để chuyển nhanh:{' '}
                  <span className='text-[#62b866] underline'>Link to Vietcombank</span>
                </a>
              )}

              <div className='border border-slate-400 py-2 px-4 rounded-md'>
                {paymentMethod === 'banking' && (
                  <p>
                    Bank:{' '}
                    <span
                      className='text-[#399162] font-semibold cursor-pointer'
                      onClick={() => handleCopy(admin.banking.name)}>
                      {admin.banking.name}
                    </span>
                  </p>
                )}
                {paymentMethod === 'momo' ? (
                  <p>
                    Account:{' '}
                    <span
                      className='text-[#a1396c] font-semibold cursor-pointer'
                      onClick={() => handleCopy(admin.momo.account)}>
                      {admin.momo.account}
                    </span>
                  </p>
                ) : (
                  <p>
                    Account:{' '}
                    <span
                      className='text-secondary font-semibold cursor-pointer'
                      onClick={() => handleCopy(admin.banking.account)}>
                      {admin.banking.account}
                    </span>
                  </p>
                )}
                <p>
                  Amount:{' '}
                  <span
                    className='text-green-500 font-semibold cursor-pointer'
                    onClick={() => handleCopy(`${total}`)}>
                    {formatPrice(total)}
                  </span>
                </p>
                <p>
                  Content:{' '}
                  <span
                    className='text-yellow-500 underline-offset-1 font-semibold cursor-pointer'
                    onClick={() => handleCopy(code)}>
                    {code}
                  </span>
                </p>
              </div>
              <p className='flex items-center gap-1 text-slate-500 mb-1'>
                <IoIosHelpCircle size={20} /> Click to copy
              </p>

              <p className=''>
                Order will be sent to you at email{' '}
                <span
                  className='text-green-500 underline cursor-pointer'
                  onClick={() => handleCopy(curUser?.email)}>
                  {curUser?.email}
                </span>{' '}
                after paid.
              </p>

              <div className='flex justify-center mt-6'>
                <div className='relative rounded-lg shadow-medium duration-300 transition hover:-translate-y-2 overflow-hidden'>
                  {paymentMethod === 'momo' ? (
                    <>
                      <Image src={admin.momo.image} height={700} width={350} alt='momo-qr' />
                      <Image
                        className='absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-[50%] w-[58%]'
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=2|99|${admin.momo.account}|||0|0|${total}|${code}|transfer_p2p`}
                        height={700}
                        width={350}
                        alt='momo-qr'
                      />
                      <Image
                        className='bg-[#000] absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-[50%] rounded-md p-1 w-[12%]'
                        src='/images/logo.png'
                        height={42}
                        width={42}
                        alt='momo-qr'
                      />
                    </>
                  ) : (
                    <>
                      <Image src={admin.banking.image} height={700} width={350} alt='banking-qr' />
                      <Image
                        className='absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-[50%] w-[47%]'
                        src={`https://img.vietqr.io/image/970436-1040587211-eeua38J.jpg?amount=${total}&addInfo=${encodeURI(
                          code
                        )}&accountName=${admin.banking.receiver}`}
                        height={700}
                        width={350}
                        alt='banking-qr'
                      />
                    </>
                  )}
                </div>
              </div>

              <Divider size={12} />
            </div>
          </div>
        </div>

        {/* MARK: Course */}
        <div className='col-span-12 lg:col-span-5 order-1 lg:order-2'>
          <div className='rounded-lg shadow-lg border-2 border-sky-400 p-3'>
            {course && (
              <div className='flex gap-21'>
                {/* Thumbnail */}
                <div className='flex-shrink-0 max-w-[180px] h-full w-full aspect-video rounded-lg shadow-lg overflow-hidden'>
                  <Image src={course.images[0]} width={200} height={200} alt='thumbnail' />
                </div>

                {/* Description */}
                <p className='w-full max-h-[150px] text-sm overflow-y-auto font-body tracking-wide'>
                  {course.description}
                </p>
              </div>
            )}

            <Divider size={6} border />

            {/* Voucher */}
            <div className='mb-2'>
              You have a voucher?{' '}
              <p className='text-nowrap inline'>
                (
                <button
                  className='text-sky-600 hover:underline z-10'
                  onClick={() => setIsShowVoucher(prev => !prev)}>
                  click here
                </button>
                )
              </p>
            </div>

            <div
              className={`flex items-center gap-2 mb-2 overflow-hidden trans-200 ${
                isShowVoucher ? 'max-h-[200px]' : 'max-h-0'
              }`}>
              <Input
                id='code'
                label='Voucher'
                disabled={applyingVoucher}
                register={register}
                errors={errors}
                required
                type='text'
                icon={RiCoupon2Fill}
                onFocus={() => clearErrors('code')}
                className='w-full'
              />
              <button
                className={`rounded-lg border py-2 px-3 text-nowrap h-[42px] flex-shrink-0 hover:bg-black trans-200 hover:text-white ${
                  applyingVoucher
                    ? 'border-slate-200 bg-slate-200 pointer-events-none'
                    : 'border-dark text-dark '
                }`}
                onClick={handleSubmit(handleApplyVoucher)}
                disabled={applyingVoucher}>
                {applyingVoucher ? (
                  <RiDonutChartFill size={26} className='animate-spin text-slate-300' />
                ) : (
                  'Apply'
                )}
              </button>
            </div>
            {voucherMessage && (
              <p className={`${voucher ? 'text-green-500' : 'text-rose-500'} mb-2`}>{voucherMessage}</p>
            )}

            <Divider size={2} />

            {/* Payment Detail */}
            <div className='rounded-lg shaodow-lg bg-dark-100 text-white p-21'>
              <p>Payment Detail</p>

              <Divider size={3} border />

              <div className='flex flex-col gap-2'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span className='font-semibold text-xl'>{formatPrice(subTotal)}</span>
                </div>

                <div className='flex justify-between'>
                  <span>Discount</span>
                  <span className='font-semibold text-xl'>{formatPrice(discount)}</span>
                </div>
              </div>

              <Divider size={3} border />

              <div className='flex items-center justify-between'>
                <span className='font-semobold'>Total</span>
                <span className='font-semibold tracking-wide text-3xl text-green-500 hover:tracking-wider trans-300'>
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Divider size={6} />

            {/* Buy Now */}
            <div className='flex items-center justify-center gap-3'>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`h-[42px] flex items-center justify-center border border-dark text-dark rounded-lg shadow-lg px-5 font-bold text-lg hover:bg-dark-0 hover:text-white trans-200 ${
                  loading ? 'bg-slate-200 pointer-events-none' : ''
                }`}>
                {loading ? (
                  <FaCircleNotch
                    size={18}
                    className='text-slate-700 group-hover:text-dark trans-200 animate-spin'
                  />
                ) : (
                  'Buy Now'
                )}
              </button>
            </div>

            <Divider size={4} />
          </div>
        </div>
      </div>

      <Divider size={20} />
    </div>
  )
}

export default CheckoutPage
