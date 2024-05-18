import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

function VerifyEmailEmail({
  name = 'Alexander Pi Pi',
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
              Bạn đã gửi yêu cầu xác minh email tại{' '}
              <span className='font-semibold'>&quot;ERE&quot;</span> lúc{' '}
              {new Intl.DateTimeFormat('vi', {
                dateStyle: 'full',
                timeStyle: 'medium',
                timeZone: 'Asia/Ho_Chi_Minh',
              })
                .format(new Date())
                .replace('lúc', '')}
              .
            </p>

            <p>Nếu đây không phải là bạn, vui lòng bỏ qua email này.</p>

            <p>
              Ngược lại, nếu đây là bạn, hãy ấn nút bên dưới để{' '}
              <a href={link} className='text-blue-500'>
                xác minh email của bạn
              </a>{' '}
              ngay.
            </p>

            {/* Button */}
            <div className='text-center p-3'>
              <a
                href={link}
                className='inline bg-secondary no-underline rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'>
                Xác minh email
              </a>
            </div>

            <p>
              Để giữ có tài khoản của bạn được an toàn, vui lòng không chia sẻ email này với bất kỳ ai.
            </p>
            <p>
              Nếu có bất kỳ thắc mắc nào? Vui lòng liên hệ ERE để được hỗ trợ một cách nhiệt tình và
              nhanh chống:{' '}
              <a href='https://www.messenger.com/t/170660996137305' className='text-blue-500'>
                Liên hệ
              </a>
            </p>
            <p>
              Chân thành cảm ơn,
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

export default VerifyEmailEmail
