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
    title: 'Lesson',
    Icon: MdPlayLesson,
    links: [
      {
        title: 'All Lessons',
        href: '/admin/lesson/all',
      },
      {
        title: 'Add Lesson',
        href: '/admin/lesson/add',
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
      account: process.env.NEXT_PUBLIC_ADMIN_PHONE!,
      receiver: process.env.NEXT_PUBLIC_ADMIN_NAME!,
      link: process.env.NEXT_PUBLIC_MOMO_LINK!,
      image: '/images/momo-qr.jpg',
    },
    banking: {
      name: process.env.NEXT_PUBLIC_BANK_NAME!,
      account: process.env.NEXT_PUBLIC_BANK_ACCOUNT!,
      receiver: process.env.NEXT_PUBLIC_ADMIN_NAME!,
      image: '/images/banking-qr.jpg',
    },
    zalo: process.env.NEXT_PUBLIC_ZALO!,
    messenger: process.env.NEXT_PUBLIC_MESSENGER!,
  },
  TRAM: {
    momo: {
      account: process.env.NEXT_PUBLIC_ADMIN_PHONE_2!,
      receiver: process.env.NEXT_PUBLIC_ADMIN_NAME_2!,
      link: process.env.NEXT_PUBLIC_MOMO_LINK_2!,
      image: '/images/momo-qr-2.jpg',
    },
    banking: {
      name: process.env.NEXT_PUBLIC_BANK_NAME_2!,
      account: process.env.NEXT_PUBLIC_BANK_ACCOUNT_2!,
      receiver: process.env.NEXT_PUBLIC_ADMIN_NAME_2!,
      image: '/images/banking-qr-2.jpg',
    },
    zalo: process.env.NEXT_PUBLIC_ZALO_2!,
    messenger: process.env.NEXT_PUBLIC_MESSENGER!,
  },
}

// MARK: Choose Me
export const chooseMeList = [
  {
    title: 'Đa dạng sản phẩm',
    image: '/images/choose-me-1.jpg',
  },
  {
    title: 'Rẻ nhất thị trường',
    image: '/images/choose-me-2.jpg',
  },
  {
    title: 'Thanh toán lập tức',
    image: '/images/choose-me-3.jpg',
  },
  {
    title: 'Bảo hành uy tín',
    image: '/images/choose-me-4.jpg',
  },
]
