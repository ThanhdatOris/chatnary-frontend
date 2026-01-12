# Chatnary Frontend

Ứng dụng frontend cho Chatnary - Nền tảng Chat AI với tài liệu sử dụng công nghệ RAG (Retrieval-Augmented Generation).

## 🚀 Tech Stack

- **Framework:** Next.js 15.4
- **Language:** TypeScript
- **Styling:** Vanilla CSS với thiết kế glassmorphism
- **State Management:** React Context API
- **Authentication:** JWT (Access Token in Memory, Refresh Token in localStorage)

## ✨ Features

- 🔐 **Authentication** - Đăng nhập/đăng ký với JWT và silent refresh
- 📁 **Project Management** - Tạo và quản lý các dự án
- 📄 **Document Upload** - Upload tài liệu PDF để AI phân tích
- 💬 **RAG Chat** - Chat với AI dựa trên nội dung tài liệu
- 🌓 **Dark/Light Mode** - Hỗ trợ giao diện sáng/tối
- 📱 **Responsive** - Tối ưu cho mọi kích thước màn hình

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/              # Trang đăng nhập
│   ├── register/           # Trang đăng ký
│   ├── dashboard/          # Trang chính
│   ├── documents/          # Quản lý tài liệu
│   └── chat/               # Chat AI
├── components/             # React components
│   ├── auth/               # Components xác thực
│   ├── chat/               # Components chat
│   ├── document/           # Components tài liệu
│   └── layout/             # Layout components
├── contexts/               # React Context providers
│   ├── AuthContext.tsx     # Quản lý auth state
│   ├── ChatContext.tsx     # Quản lý chat state
│   └── ThemeContext.tsx    # Quản lý theme
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities và API client
│   ├── api.ts              # API client
│   ├── auth.ts             # Auth service
│   └── types.ts            # TypeScript types
└── styles/                 # Global styles
```

## 🔧 Setup

### Prerequisites

- Node.js 18+
- npm hoặc yarn

### Installation

```bash
# Clone repository
git clone https://github.com/ThanhdatOris/chatnary-frontend.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://chatnary.up.railway.app/api/v1/
NEXT_PUBLIC_BYPASS_AUTH=0
```

## 🖥️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔐 Authentication Flow

1. **Login** → Server trả về access token (body) + refresh token
2. **Access Token** → Lưu trong memory (bảo vệ XSS)
3. **Refresh Token** → Lưu trong localStorage (fallback cho HttpOnly cookie)
4. **Auto Refresh** → Tự động refresh token trước khi hết hạn
5. **401 Error** → Tự động refresh và retry request

## 📸 Screenshots

| Login                                   | Dashboard                                       | Chat                                  |
| --------------------------------------- | ----------------------------------------------- | ------------------------------------- |
| ![Login](/public/screenshots/login.png) | ![Dashboard](/public/screenshots/dashboard.png) | ![Chat](/public/screenshots/chat.png) |

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

Made with ❤️ by Chatnary Team
