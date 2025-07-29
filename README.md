# 📚 ERE - E-Learning Platform

ERE là một nền tảng học trực tuyến toàn diện được xây dựng bằng Next.js, cung cấp trải nghiệm học tập hiện đại với đầy đủ tính năng quản lý khóa học, người dùng và thanh toán.

## 🚀 Tính năng chính

### 🎓 Cho Học viên

- **Khám phá khóa học**: Duyệt và tìm kiếm khóa học theo danh mục
- **Học tập tương tác**: Video bài học, theo dõi tiến độ học tập
- **Q&A cộng đồng**: Đặt câu hỏi và tham gia thảo luận
- **Bình luận & đánh giá**: Tương tác với nội dung và cộng đồng
- **Hệ thống thông báo**: Nhận cập nhật về khóa học và hoạt động
- **Quản lý tài khoản**: Cập nhật thông tin cá nhân, avatar

### 👨‍🏫 Cho Giảng viên & Admin

- **Quản lý khóa học**: Tạo, chỉnh sửa và quản lý khóa học
- **Quản lý nội dung**: Tổ chức chapter và lesson
- **Quản lý người dùng**: Kiểm soát quyền truy cập và chặn người dùng
- **Hệ thống voucher**: Tạo và quản lý mã giảm giá
- **Flash Sale**: Tạo các chương trình khuyến mãi có thời hạn
- **Báo cáo thống kê**: Theo dõi doanh thu và hoạt động

### 💳 Thương mại điện tử

- **Thanh toán đa dạng**: Hỗ trợ nhiều phương thức thanh toán
- **Hệ thống đơn hàng**: Quản lý mua khóa học và tặng quà
- **Voucher & giảm giá**: Áp dụng mã giảm giá linh hoạt
- **Flash Sale**: Khuyến mãi thời gian có hạn

## 🛠️ Công nghệ sử dụng

### Frontend

- **Next.js 14** - React framework với App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Sass** - CSS preprocessor
- **Framer Motion** - Animation library
- **React Hook Form** - Form validation
- **Redux Toolkit** - State management

### Backend & Database

- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **NextAuth.js** - Authentication solution
- **Bcrypt** - Password hashing
- **JWT** - JSON Web Tokens

### UI/UX & Media

- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Cloudinary** - Media management
- **Sharp** - Image processing

### Email & Communication

- **Nodemailer** - Email sending
- **React Email** - Email templates

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📁 Cấu trúc thư mục

```
ere/
├── public/                     # Static assets
│   ├── images/                 # Hình ảnh
│   └── banners/               # Banner quảng cáo
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (admin)/          # Trang admin
│   │   ├── (auth)/           # Trang xác thực
│   │   ├── (home)/           # Trang chính
│   │   ├── (learning)/       # Trang học tập
│   │   ├── api/              # API routes
│   │   └── email/            # Email templates
│   ├── components/           # React components
│   │   ├── admin/            # Components cho admin
│   │   ├── dialogs/          # Modal dialogs
│   │   ├── email/            # Email components
│   │   └── setting/          # Setting components
│   ├── config/               # Cấu hình
│   ├── constants/            # Hằng số
│   ├── libs/                 # Libraries & hooks
│   │   └── reducers/         # Redux reducers
│   ├── models/               # Database models
│   ├── requests/             # API requests
│   └── utils/                # Utility functions
└── ...config files
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- **Node.js** 18+
- **MongoDB** 5.0+
- **npm/yarn/pnpm**

### 1. Clone repository

```bash
git clone https://github.com/NaKMiers/Educational_Resources.git
cd ere
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env.local` và thêm các biến môi trường:

```env
# Database
MONGODB=mongodb://localhost:27017/ere

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Email
NEXT_PUBLIC_MAIL=your-email@gmail.com
MAIL_APP_PASSWORD=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Others
BCRYPT_SALT_ROUND=10
NEXT_PUBLIC_DEFAULT_AVATAR=/images/default-avatar.jpg
```

### 4. Chạy ứng dụng

#### Development mode

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

#### Production mode

```bash
npm run build
npm run start
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📊 Database Models

### Các model chính:

- **User**: Quản lý người dùng, authentication, roles
- **Course**: Khóa học với thông tin chi tiết
- **Chapter**: Chương học trong khóa học
- **Lesson**: Bài học cụ thể
- **Comment**: Bình luận và thảo luận
- **Question**: Câu hỏi từ cộng đồng
- **Order**: Đơn hàng mua khóa học
- **Voucher**: Mã giảm giá
- **FlashSale**: Chương trình khuyến mãi
- **Category**: Danh mục khóa học
- **Tag**: Thẻ gắn khóa học

## 🔐 Authentication & Authorization

### Các loại tài khoản:

- **Admin**: Toàn quyền quản lý hệ thống
- **Editor**: Quản lý nội dung
- **Collaborator**: Hỗ trợ vận hành
- **User**: Học viên thông thường

### Phương thức đăng nhập:

- Email/Password (Local)
- Google OAuth
- GitHub OAuth

## 🎨 UI/UX Features

- **Responsive Design**: Tối ưu cho mọi thiết bị
- **Dark/Light Theme**: Chế độ sáng/tối
- **3D Effects**: Hiệu ứng 3D với Framer Motion
- **Loading States**: Trạng thái loading mượt mà
- **Toast Notifications**: Thông báo real-time
- **Modal Dialogs**: Dialog tương tác

## 📱 API Routes

### Public APIs

- `GET /api` - Homepage data
- `GET /api/course/[slug]` - Course details
- `GET /api/question/[slug]/detail` - Question details

### Protected APIs

- `POST /api/auth/*` - Authentication
- `GET/POST/PUT/DELETE /api/admin/*` - Admin operations
- `POST /api/comment/*` - Comment system
- `POST /api/order/*` - Order processing

## 🔧 Scripts

```bash
# Development
npm run dev
npm run build
npm run start
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Kết nối repository với Vercel
2. Cấu hình biến môi trường
3. Deploy tự động

**ERE Platform** - Nơi tri thức được chia sẻ và phát triển 🚀
