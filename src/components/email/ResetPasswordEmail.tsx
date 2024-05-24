import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

function ResetPasswordEmail({
  name = 'David Pi',
  link = 'https://ere-eta.vercel.app',
}: {
  name?: string
  link?: string
}) {
  return (
    <Tailwind
      config={{
        theme,
      }}>
      <Body className='text-dark font-sans'>
        <Container className='bg-white p-4 pb-6'>
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

          <div
            className='border-t'
            style={{
              borderTop: '1px solid rgb(0, 0, 0, 0.1)',
            }}
          />

          <Section className='px-5'>
            <p>Hi {name},</p>
            <p>
              You have sent a request to restore password at{' '}
              <span className='font-semibold'>&quot;ERE&quot;</span> at{' '}
              {new Intl.DateTimeFormat('en', {
                dateStyle: 'full',
                timeStyle: 'medium',
                timeZone: 'Asia/Ho_Chi_Minh',
              }).format(new Date())}
              .
            </p>

            <p>If this is not you, please ignore this email.</p>

            <p>
              On the contrary, if this is you, please click the button below to{' '}
              <a href={link} className='text-blue-500'>
                restore your password
              </a>{' '}
              now.
            </p>

            <div className='text-center p-3'>
              <a
                href={link}
                className='inline bg-sky-500 no-underline rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'>
                Restore password
              </a>
            </div>

            <p>To keep your account in secure, do not share this email to anyone else!</p>
            <p>
              If you have any questions? Please contact us for fast and enthusiastic support:{' '}
              <a href='https://www.messenger.com/t/170660996137305' className='text-blue-500'>
                Contact
              </a>
            </p>
            <p>
              Thank you very much,
              <br />
              ERE
            </p>
          </Section>

          {/* Footer */}
          <div className='flex justify-center pt-[45px]'>
            <Img
              className='max-w-full'
              width={620}
              src={`${'https://ere-eta.vercel.app'}/images/footer-banner.jpg`}
            />
          </div>

          <p className='text-center text-xs text-slate-600'>
            © 2023 | ERE - Developed by Nguyen Anh Khoa, Dao Gia Bao, Phuong Anh, Quoc Thang, All rights
            reserved.
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

export default ResetPasswordEmail
