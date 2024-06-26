import { FaTicketAlt } from 'react-icons/fa'
import { FaBoltLightning, FaListCheck, FaTags, FaUser } from 'react-icons/fa6'
import { MdCategory, MdPlayLesson, MdReportOff, MdSpaceDashboard } from 'react-icons/md'
import { RiBillFill } from 'react-icons/ri'
import { SiCoursera } from 'react-icons/si'

// MARK: Admin Links
export const adminLinks = [
  {
    title: 'Dashboard',
    Icon: MdSpaceDashboard,
    links: [
      {
        title: 'Dashboard',
        href: '/admin',
      },
    ],
  },
  {
    title: 'Order',
    Icon: RiBillFill,
    links: [
      {
        title: 'All Orders',
        href: '/admin/order/all',
      },
    ],
  },
  {
    title: 'Course',
    Icon: SiCoursera,
    links: [
      {
        title: 'All Courses',
        href: '/admin/course/all',
      },
      {
        title: 'Add Course',
        href: '/admin/course/add',
      },
    ],
  },
  {
    title: 'User',
    Icon: FaUser,
    links: [
      {
        title: 'All Users',
        href: '/admin/user/all',
      },
    ],
  },
  {
    title: 'Summary',
    Icon: FaListCheck,
    links: [
      {
        title: 'All Summaries',
        href: '/admin/summary/all',
      },
    ],
  },

  {
    title: 'Tag',
    Icon: FaTags,
    links: [
      {
        title: 'All Tags',
        href: '/admin/tag/all',
      },
      {
        title: 'Add Tag',
        href: '/admin/tag/add',
      },
    ],
  },
  {
    title: 'Category',
    Icon: MdCategory,
    links: [
      {
        title: 'All Categories',
        href: '/admin/category/all',
      },
      {
        title: 'Add Category',
        href: '/admin/category/add',
      },
    ],
  },
  {
    title: 'Voucher',
    Icon: FaTicketAlt,
    links: [
      {
        title: 'All Vouchers',
        href: '/admin/voucher/all',
      },
      {
        title: 'Add Voucher',
        href: '/admin/voucher/add',
      },
    ],
  },
  {
    title: 'Flash Sale',
    Icon: FaBoltLightning,
    links: [
      {
        title: 'All Flash Sales',
        href: '/admin/flash-sale/all',
      },
      {
        title: 'Add Flash Sale',
        href: '/admin/flash-sale/add',
      },
    ],
  },
  {
    title: 'Report',
    Icon: MdReportOff,
    links: [
      {
        title: 'All Reports',
        href: '/admin/report/all',
      },
    ],
  },
]

// MARK: Admin List
export const admins = {
  KHOA: {
    momo: {
      account: '0899320427',
      receiver: 'Nguyễn Anh Khoa',
      link: 'https://me.momo.vn/anphashop',
      image: '/images/momo-qr.jpg',
    },
    banking: {
      name: 'Vietcombank',
      account: '1040587211',
      receiver: 'Nguyễn Anh Khoa',
      image: '/images/banking-qr.jpg',
    },
    zalo: 'https://zalo.me/0899320427',
    messenger: 'https://www.messenger.com/t/170660996137305',
  },
}

// MARK: Choose Me
export const features = [
  {
    title: 'Video bài giảng chất lượng cao',
    image: '/images/feature-1.png',
    description:
      'Với những bài giảng từ các thầy cô uy tín và các nguồn đáng tin cậy trong chuyên ngành chuyên môn, đảm bảo nắm bắt đúng trọng tâm nâng cao kiến thức.',
  },
  {
    title: 'Giá thành hợp lí ',
    image: '/images/feature-2.png',
    description:
      'Giá cả hợp lí, tiếp cận nhiều nguồn khách hàng, nâng cao phạm vi trải nghiệm nền giáo dục chỉ có tại ERE. Giúp các bạn trẻ có thể tiếp cận được ERE.',
  },
  {
    title: 'Trao đổi kiến thức',
    image: '/images/feature-3.png',
    description:
      'Với chức năng đăng câu hỏi, các học viên có thể trực tiếp trao đổi bài giảng của nhau, giúp đỡ nhau giải bày các thắc mắc.',
  },
]

// MARK: Report Contents
export const reportContents = {
  question: ['Violence', '18+', 'Spam', 'Fake', 'Duplicate', 'Offensive'],
  comment: ['Violence', '18+', 'Spam', 'Fake', 'Duplicate', 'Offensive', 'Harassment', 'Hate Speech'],
  lesson: [
    'Violence',
    '18+',
    'Spam',
    'Fake',
    'Duplicate',
    'Offensive',
    'Harassment',
    'Hate Speech',
    'Wrong Information',
  ],
  course: [
    'Violence',
    '18+',
    'Spam',
    'Fake',
    'Duplicate',
    'Offensive',
    'Harassment',
    'Hate Speech',
    'Wrong Information',
  ],
}
