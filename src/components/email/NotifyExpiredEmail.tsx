import { expiredData } from '@/constants/emailDataSamples'
import { Body, Column, Container, Img, Row, Section, Tailwind, Text } from '@react-email/components'
import { theme } from '../../../tailwind.config'

export function NotifyExpiredEmail({ data = expiredData }: { data?: any }) {
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
                <h1 className='text-2xl font-bold text-center'>
                  Tài khoản của bạn sẽ hết hạn sau{' '}
                  <span className='text-rose-500'>{data.remainingTime}</span> nữa 🥲{' '}
                </h1>

                <div className='text-sm mt-8'>
                  <p>
                    <b>Ngày đặt hàng: </b>
                    {new Intl.DateTimeFormat('vi', {
                      dateStyle: 'full',
                      timeStyle: 'medium',
                      timeZone: 'Asia/Ho_Chi_Minh',
                    })
                      .format(new Date(data.createdAt))
                      .replace('lúc', '')}
                  </p>
                  <p>
                    <b>Trạng thái: </b>
                    <span className='text-slate-400'>Hết hạn sau {data.remainingTime} nữa.</span>
                  </p>
                  <p>
                    <b>Email: </b>
                    <span className='text-[#0a82ed]'>{data.usingUser}</span>
                  </p>
                </div>

                {/* Course */}
                <p className='text-center mt-8'>
                  <b className='text-[24px]'>Sản phẩm</b>
                </p>

                <div
                  style={{
                    border: '1px solid rgb(0, 0, 0, 0.1)',
                  }}
                  className='border rounded-lg p-21/2 mb-4'>
                  <Text className='font-semibold m-0 text-slate-500'>{data.type.title}</Text>

                  <p className='whitespace-pre m-0 py-4 max-w-[600px] overflow-x-auto border-b '>
                    {data.info}
                  </p>
                </div>
              </Column>
            </Row>

            <p className='italic text-sm text-slate-500 text-center px-21'>
              *Vui lòng gia hạn để tiếp tục sử dụng dịch vụ. Xin chân thành cảm ơn!
            </p>

            <div className='text-center p-3 mb-10'>
              <a
                href={`https://anpha.shop/${data.type.slug}`}
                className='inline bg-secondary no-underline rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'>
                Gia hạn ngay
              </a>
            </div>
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

export default NotifyExpiredEmail
