import { formatPrice } from '@/utils/number'
import { Body, Column, Container, Img, Row, Section, Tailwind, Text } from '@react-email/components'
import { theme } from '../../../tailwind.config'
import { summary as summarySample } from '@/constants/dataSamples'

export function SummaryEmail({ summary = summarySample }: { summary?: any }) {
  const { collaborator: user, vouchers, income } = summary
  const curMonth = new Date().getMonth() + 1

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
                    src={`${'https://ere-eta.vercel.app'}/images/logo.jpg`}
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
                <h1 className='text-2xl font-bold text-center'>
                  Hi{' '}
                  {user.firstName && user.lastname
                    ? user.firstName + ' ' + user.lastname
                    : user.username}
                  👋{' '}
                </h1>

                <h2 className='text-3xl text-slate-400 mt-0 font-semibold text-center'>
                  Month Income Report
                </h2>

                <div className='text-sm mt-8'>
                  <p>
                    <b>Collaborator: </b>
                    <span>
                      {(user.firstName && user.lastname
                        ? user.firstName + ' ' + user.lastname
                        : user.username) || user.email}
                    </span>
                  </p>
                  <p>
                    <b>Commission: </b>
                    <span className='font-semibodl text-rose-500'>{user.commission.value}</span>
                  </p>
                  <p>
                    <b>Number of vouchers in month: </b>
                    <span>{vouchers.length}</span>
                  </p>
                  <p>
                    <b>Month Income {curMonth}: </b>
                    <b className='text-green-500'>{formatPrice(income)}</b>
                  </p>
                </div>

                {/* Vouchers */}
                <p className='text-center mt-8'>
                  <b className='text-[24px]'>Vouchers</b>
                </p>

                <div className='rounded-lg' style={{ border, boxSizing: 'border-box' }}>
                  <div
                    className='w-full text-center p-3'
                    style={{ borderBottom: border, boxSizing: 'border-box' }}>
                    <div className='inline-block w-1/2 font-semibold'>Voucher</div>
                    <div className='inline-block w-1/2 font-semibold'>
                      <span>Tích lũy</span>
                    </div>
                  </div>
                  {vouchers.map((voucher: any, index: number) => (
                    <div
                      className='w-full text-center p-3'
                      style={{
                        borderBottom: index != vouchers.length - 1 ? border : 0,
                        boxSizing: 'border-box',
                      }}
                      key={voucher._id}>
                      <div className='inline-block w-1/2'>
                        <span className='text-secondary'>{voucher.code}</span>
                      </div>
                      <div className='inline-block w-1/2'>
                        <span className='text-green-500'>{formatPrice(voucher.accumulated)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className='text-center text-sm text-slate-500'>
                  Xin chân thành cảm ơn bạn đã đồng hành cùng ERE trong thời gian qua. Chúc bạn một ngày
                  tốt lành 😊
                </p>
              </Column>
            </Row>
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

export default SummaryEmail

const border = '1px solid rgb(0, 0, 0, 0.1)'
