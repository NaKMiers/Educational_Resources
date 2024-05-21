import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'
import { commentData } from '@/constants/dataSamples'

export function NotifyCommentEmail({ data = commentData }: { data?: any }) {
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
                <h1 className='text-2xl font-bold text-center'>Hi {data.receiver}👋 </h1>
                <h2 className='text-xl font-semibold text-center'>
                  Có người vừa phản hồi bình luận của bạn, hãy phản hồi lại ngay nào 😊!
                </h2>

                <div className='text-sm mt-8'>
                  <p>
                    <b>Người bình luận: </b>
                    <span className='text-secondary tracking-wider font-semibold'>
                      {data.senderName}
                    </span>{' '}
                    <span className='text-slate-500'>({data.senderEmail})</span>
                  </p>
                  <p>
                    <b>Người nhận: </b>
                    <span className='text-secondary tracking-wider font-semibold'>
                      {data.receiver}
                    </span>{' '}
                    <span className='text-slate-500'>({data.receiverEmail})</span>
                  </p>
                  <p>
                    <b>Thời gian: </b>
                    {new Intl.DateTimeFormat('vi', {
                      dateStyle: 'full',
                      timeStyle: 'medium',
                      timeZone: 'Asia/Ho_Chi_Minh',
                    }).format(new Date(data.time))}
                  </p>
                  <p>
                    <b>Nội dung: </b>
                    <span className='text-slate-500'>{data.content}</span>
                  </p>
                </div>
              </Column>
            </Row>

            <div className='text-center p-3 mb-10'>
              <a
                href={data.slug}
                className='inline no-underline rounded-lg font-semibold cursor-pointer py-3 px-7 text-slate-500'
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                }}>
                Phản hồi ngay
              </a>
            </div>
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

export default NotifyCommentEmail
