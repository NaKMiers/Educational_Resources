import { order as orderSample } from '@/constants/emailDataSamples'
import { formatPrice } from '@/utils/number'
import { Body, Column, Container, Img, Row, Section, Tailwind, Text } from '@react-email/components'
import { theme } from '../../../tailwind.config'

export function OrderEmail({ order = orderSample }: { order?: any }) {
  return (
    <Tailwind
      config={{
        theme,
      }}>
      <Body className='text-dark font-sans'>
        <Container className='bg-white p-4'>
          <Section className='inline-block mx-auto'>
            <Row className='mb-3 w-full'>
              <Column>
                <a href='https://anpha.shop'>
                  <Img
                    className='aspect-square rounded-full'
                    src={`${'https://anpha.shop'}/images/logo.jpg`}
                    width={35}
                    height={35}
                    alt='logo'
                  />
                </a>
              </Column>
              <Column>
                <a
                  href='https://anpha.shop'
                  className='text-2xl font-bold tracking-[0.3px] no-underline text-dark'>
                  .AnphaShop
                </a>
              </Column>
            </Row>
          </Section>

          <Section
            className='rounded-lg overflow-hidden'
            style={{
              border: '1px solid rgb(0, 0, 0, 0.1)',
            }}>
            <div>
              <Img src='https://anpha.shop/images/brand-banner.jpg' className='w-full object-cover' />
            </div>

            <Row className='p-4'>
              <Column className='font'>
                <h1 className='text-2xl font-bold text-center'>Hi👋 </h1>
                <h2 className='text-xl font-semibold text-center'>
                  Cảm ơn bạn đã mua hàng, chúc bạn một ngày tốt lành!
                </h2>

                <div className='text-sm mt-8'>
                  <p>
                    <b>Mã đơn hàng: </b>
                    <span className='text-secondary tracking-wider font-semibold'>{order.code}</span>
                  </p>
                  <p>
                    <b>Ngày đặt hàng: </b>
                    {new Intl.DateTimeFormat('vi', {
                      dateStyle: 'full',
                      timeStyle: 'medium',
                      timeZone: 'Asia/Ho_Chi_Minh',
                    })
                      .format(new Date(order.createdAt))
                      .replace('lúc', '')}
                  </p>
                  <p>
                    <b>Trạng thái: </b>
                    <span className='text-[#50C878]'>Đã giao</span>
                  </p>
                  <p>
                    <b>Tổng tiền: </b>
                    <b>{formatPrice(order.total)}</b>
                  </p>
                  <p>
                    <b>Email: </b>
                    <span className='text-[#0a82ed]'>{order.email}</span>
                  </p>
                </div>

                {/* Message From Admin */}
                {order.message && typeof order.message === 'string' && order.message.trim() && (
                  <div
                    className='px-21 py-21/2 rounded-lg'
                    style={{
                      border: '1px solid rgb(0, 0, 0, 0.1)',
                    }}>
                    <p className='font-semibold underline tracking-wider text-sm text-slate-400 text-center m-0 mb-3'>
                      Lời nhắn từ quản trị viên
                    </p>
                    <p className='text-sm m-0'>{order.message}</p>
                  </div>
                )}

                {/* Product */}
                <p className='text-center mt-8'>
                  <b className='text-[24px]'>Sản phẩm</b>
                </p>

                {order.items.map((item: any) => (
                  <div
                    style={{
                      border: '1px solid rgb(0, 0, 0, 0.1)',
                    }}
                    className='border rounded-lg p-21/2 mb-4'
                    key={item._id}>
                    <Text className='font-semibold m-0 text-slate-500'>{item.product.title}</Text>

                    {order.lessons
                      .find((acc: any) => acc.productId === item.product._id)
                      .lessons.map((lesson: any) => (
                        <Text
                          key={lesson._id}
                          className='whitespace-pre m-0 py-4 max-w-[600px] overflow-x-auto border-b '>
                          {lesson.info}
                        </Text>
                      ))}
                  </div>
                ))}
              </Column>
            </Row>

            {order.userId && (
              <div className='text-center p-3 mb-8'>
                <a
                  href={`https://anpha.shop/user/order/${order.code}`}
                  className='inline bg-primary no-underline rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'>
                  Xem chi tiết
                </a>
              </div>
            )}
          </Section>

          <div className='flex justify-center pt-[45px]'>
            <Img
              className='max-w-full'
              width={620}
              src={`${'https://anpha.shop'}/images/footer-banner.jpg`}
            />
          </div>

          <p className='text-center text-xs text-slate-600'>
            © 2023 | Anpha Shop - Developed by Nguyen Anh Khoa, All rights reserved.
          </p>

          <div className='text-center'>
            <a
              href='https://zalo.me/0899320427'
              target='_blank'
              rel='noreferrer'
              className='inline-block'>
              <Img src={`${'https://anpha.shop'}/images/zalo.jpg`} width={35} height={35} alt='zalo' />
            </a>
            <a
              href='https://www.messenger.com/t/170660996137305'
              target='_blank'
              rel='noreferrer'
              className='inline-block ml-2'>
              <Img
                src={`${'https://anpha.shop'}/images/messenger.jpg`}
                width={35}
                height={35}
                alt='messenger'
              />
            </a>
          </div>
        </Container>
      </Body>
    </Tailwind>
  )
}

export default OrderEmail
