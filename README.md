# Fit-Link Platform — Frontend Client

> Modern Single Page Application (SPA) for the Fit-Link personal trainer marketplace, connecting students with certified coaches.

---

## 🌟 Tech Stack

- **Core:** React 19, Vite 6, React Router v7
- **Styling & UI:** TailwindCSS 3, Lucide React, Framer Motion, Swiper, Lottie React
- **State & Communication:** React Context API, Socket.IO Client, Axios (with httpOnly cookie interceptor)
- **Forms & Validation:** React Hook Form + Yup resolver
- **Data Visualization & Scheduling:** FullCalendar, React Big Calendar, Chart.js, React Leaflet / MapLibre GL
- **Third-party Services:** Google OAuth (@react-oauth/google), PayOS Payment Gateway

---

## 📁 Key Directories

```
frontend/src/
├── api/            # Centralized Axios client & Socket.IO client
├── auth/           # Token & authentication helpers
├── components/     # Shared & module UI components (chat, pt, student, ...)
├── contexts/       # AuthContext, SocketContext, NotificationContext, BookingContext
├── layouts/        # MainLayout, AdminLayout, PTSidebar
├── pages/          # Admin, PT, Student, Booking, Auth pages
├── routes/         # AppRouter (route guards with PrivateRoute)
└── services/       # Feature API services
```

---

## 🚀 Getting Started

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `frontend/` root:
```env
VITE_API_BASE_URL=http://localhost:8017/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 3. Development Server
```bash
npm run dev
# Running at http://localhost:5173
```

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## 🔐 Route Security Matrix

| Role | Accessible Routes |
|---|---|
| **Public / Guest** | `/home`, `/about`, `/news`, `/contact`, `/list-pt`, `/trainer/:id`, `/login`, `/register`, `/forgot-password` |
| **Student** | `/profile`, `/training-calendar`, `/my-packages`, `/chat`, `/chat-ai`, `/booking/:id`, `/payment/result`, `/notifications` |
| **Personal Trainer (PT)** | `/profile`, `/pt/dashboard`, `/pt/packages`, `/pt/schedule`, `/pt/students`, `/pt/wallet`, `/pt/materials`, `/pt/feedback`, `/pt/chat`, `/pt/approval-request` |
| **Admin** | `/admin`, `/admin/users`, `/admin/users/pts`, `/admin/users/students`, `/admin/payouts`, `/admin/pt-requests`, `/admin-transactions` |

