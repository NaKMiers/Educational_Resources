import { Body, Column, Container, Img, Row, Section, Tailwind, Text } from '@react-email/components'
import { theme } from '../../../tailwind.config'
import { formatPrice } from '@/utils/number'
import { updateInfoData } from '@/constants/emailDataSamples'

export function UpdateInfoEmail({ data = updateInfoData }: { data?: any }) {
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
                <h1 className='text-2xl font-bold text-center'>Hi👋</h1>
                <h2 className='text-xl font-semibold text-center'>
                  Cập nhật lại thông tin tài khoản vì lí do bảo mật
                </h2>

                <div className='text-sm mt-8'>
                  <p>
                    <b>Mã đơn hàng: </b>
                    <span className='text-secondary tracking-wider font-semibold'>{data.code}</span>
                  </p>
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
                    <span className='text-[#50C878]'>Đã giao</span>
                  </p>
                  <p>
                    <b>Tổng tiền: </b>
                    <b>{formatPrice(data.total)}</b>
                  </p>
                  <p>
                    <b>Email: </b>
                    <span className='text-[#0a82ed]'>{data.email}</span>
                  </p>
                </div>

                {/* Message From Admin */}
                {data.message && typeof data.message === 'string' && data.message.trim() && (
                  <div
                    className='px-21 py-21/2 rounded-lg'
                    style={{
                      border: '1px solid rgb(0, 0, 0, 0.1)',
                    }}>
                    <p className='font-semibold underline tracking-wider text-sm text-slate-400 text-center m-0 mb-3'>
                      Lời nhắn từ quản trị viên
                    </p>
                    <p className='text-sm m-0'>{data.message}</p>
                  </div>
                )}

                {/* Product */}
                <p className='text-center mt-8'>
                  <b className='text-xl'>
                    Sản phẩm: <span className='italic text-slate-500'>{data.product.title}</span>
                  </b>
                </p>

                <div
                  style={{
                    border: '1px solid rgb(0, 0, 0, 0.1)',
                  }}
                  className='border rounded-lg p-21/2 mb-4 bg-sky-50'>
                  {/* New Info */}
                  <p className='font-semibold text-secondary m-0 mb-4 underline text-sm'>
                    Thông tin mới:
                  </p>

                  <p className='whitespace-pre m-0 max-w-[600px] overflow-x-auto border-b '>
                    {data.newInfo.info}
                  </p>
                </div>

                <div
                  style={{
                    border: '1px solid rgb(0, 0, 0, 0.1)',
                  }}
                  className='border rounded-lg p-21/2 mb-4 bg-slate-100 text-slate-500'>
                  {/* Old Info */}
                  <p className='font-semibold m-0 mb-4 underline text-sm'>Thông tin cũ:</p>

                  <p className='whitespace-pre m-0 max-w-[600px] overflow-x-auto border-b '>
                    {data.oldInfo.info}
                  </p>
                </div>

                <p className='text-center text-sm text-slate-600'>
                  Xin lỗi bạn vì sự bất tiện này 😢, xin vui lòng đăng nhập lại và tiếp tục sử dịch vụ.
                  Xin chân thành cảm ơn 😊
                </p>
              </Column>
            </Row>
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

export default UpdateInfoEmail
