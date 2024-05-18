import { order as orderSample } from '@/constants/emailDataSamples'
import { formatPrice } from '@/utils/number'
import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

export function NotifyOrderEmail({ order = orderSample }: { order?: any }) {
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
                <a href='https://ere-eta.vercel.app'>
                  <Img
                    className='aspect-square rounded-full'
                    src={`${'https://ere-eta.vercel.app'}/images/logo.png`}
                    width={35}
                    height={35}
                    alt='logo'
                  />
                </a>
              </Column>
              <Column>
                <a
                  href='https://ere-eta.vercel.app'
                  className='text-2xl font-bold tracking-[0.3px] no-underline text-dark'>
                  ERE
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
              <Img
                src='https://ere-eta.vercel.app/images/brand-banner.jpg'
                className='w-full object-cover'
              />
            </div>

            <Row className='p-4'>
              <Column className='font'>
                <h1 className='text-2xl font-bold text-center'>Hi👋 </h1>
                <h2 className='text-xl font-semibold text-center'>You have an order from ERE.</h2>

                <div className='text-sm mt-8'>
                  <p>
                    <b>Code: </b>
                    <span className='text-secondary tracking-wider font-semibold'>{order.code}</span>
                  </p>
                  <p>
                    <b>Bought Date: </b>
                    {new Intl.DateTimeFormat('vi', {
                      dateStyle: 'full',
                      timeStyle: 'medium',
                      timeZone: 'Asia/Ho_Chi_Minh',
                    }).format(new Date(order.createdAt))}
                  </p>
                  <p>
                    <b>Status: </b>
                    <span className='text-yellow-500'>Pending</span>
                  </p>
                  <p>
                    <b>Total: </b>
                    <b>{formatPrice(order.total)}</b>
                  </p>
                  <p>
                    <b>Email: </b>
                    <span className='text-[#0a82ed]'>{order.email}</span>
                  </p>
                </div>

                {/* Course */}
                <div className='mt-8'>
                  <b className='text-[24px]'>Course: </b>

                  <a
                    href={`https://ere-eta.vercel.app/${order.item.slug}`}
                    className='block h-full text-dark tracking-wider no-underline mt-2'>
                    <Section>
                      <Row>
                        <Column className='w-[130px]'>
                          <Img
                            src={order.item.images[0]}
                            width={120}
                            className='inline aspect-video rounded-lg object-cover'
                          />
                        </Column>
                        <Column>
                          <p className='font-semibold text-slate-600'>{order.title}</p>
                        </Column>
                      </Row>
                    </Section>
                  </a>
                </div>
              </Column>
            </Row>

            {order.userId && (
              <div className='text-center p-3 mb-8'>
                <a
                  href={`https://ere-eta.vercel.app/admin/order/all`}
                  className='inline bg-primary no-underline rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'>
                  Giao hàng ngay
                </a>
              </div>
            )}
          </Section>

          <div className='flex justify-center pt-[45px]'>
            <Img
              className='max-w-full'
              width={620}
              src={`${'https://ere-eta.vercel.app'}/images/footer-banner.jpg`}
            />
          </div>

          <p className='text-center text-xs text-slate-600'>
            © 2023 | ERE - Developed by Nguyen Anh Khoa, All rights reserved.
          </p>

          <div className='text-center'>
            <a
              href='https://zalo.me/0899320427'
              target='_blank'
              rel='noreferrer'
              className='inline-block'>
              <Img
                src={`${'https://ere-eta.vercel.app'}/images/zalo.jpg`}
                width={35}
                height={35}
                alt='zalo'
              />
            </a>
            <a
              href='https://www.messenger.com/t/170660996137305'
              target='_blank'
              rel='noreferrer'
              className='inline-block ml-2'>
              <Img
                src={`${'https://ere-eta.vercel.app'}/images/messenger.jpg`}
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

export default NotifyOrderEmail
