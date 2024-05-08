import { Body, Column, Container, Img, Row, Section, Tailwind } from '@react-email/components'
import { theme } from '../../../tailwind.config'

export function ShortageAccountEmail({
  message = 'Thiếu sản phẩm gì gì đó rồi á',
}: {
  message?: string
}) {
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
              border: '2px solid #f44336',
            }}>
            <div>
              <Img src='https://anpha.shop/images/brand-banner.jpg' className='w-full object-cover' />
            </div>

            <Row className='py-4 px-8'>
              <Column className='font'>
                <h1 className='text-2xl font-bold text-center'>Oh Nooooo....😱 </h1>
                <h2
                  className='text-xl font-semibold text-center text-rose-500 rounded-lg py-21/2 px-21 bg-yellow-100'
                  style={{
                    border: '2px solid #f44336',
                  }}>
                  {message}
                </h2>
              </Column>
            </Row>

            <div className='text-center p-3 mb-10'>
              <a
                href={`https://anpha.shop/admin/product/add`}
                className='inline bg-secondary no-underline rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'>
                Thêm sản phẩm ngay
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

export default ShortageAccountEmail
