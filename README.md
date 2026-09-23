# Fit-Link Platform — Frontend Client

> Modern Single Page Application (SPA) for the Fit-Link personal trainer marketplace, connecting students with certified coaches.
>
> Backend: [fitlink-api](https://github.com/nguyentuanminh0763/fitlink-api)

---

## 🌟 Tech Stack

- **Core:** React 19, Vite 6, React Router v7
- **Styling & UI:** TailwindCSS 3, Lucide React, Framer Motion, Swiper, Lottie React
- **Data Fetching & Caching:** TanStack Query v5 (RAM caching with 5-minute `staleTime`, zero-latency tab switching)
- **State & Communication:** React Context API, Socket.IO Client, Axios (with httpOnly cookie credentials)
- **Forms & Validation:** React Hook Form + Yup resolver
- **Data Visualization & Scheduling:** FullCalendar, React Big Calendar, Chart.js, React Leaflet / MapLibre GL
- **Containerization:** Multi-stage Dockerfile + Nginx Alpine reverse proxy
- **Third-party Services:** Google OAuth (@react-oauth/google), PayOS Payment Gateway

---

## 📁 Key Directories

```
src/
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

### 1. Prerequisites
- **Node.js 20** and npm 10
- The backend running on `http://localhost:3000` — follow the Quick start in [fitlink-api](https://github.com/nguyentuanminh0763/fitlink-api#-getting-started) (it also seeds the demo accounts)

### 2. Quick start
```bash
git clone https://github.com/nguyentuanminh0763/fitlink-portal.git
cd fitlink-portal

cp .env.example .env.local   # public keys only, works as-is
npm ci                       # installs the exact versions from package-lock.json
npm run dev                  # http://localhost:5173
```

> PowerShell: use `Copy-Item .env.example .env.local` instead of `cp`.

Log in with a demo account, e.g. `student.kiet@fitlink.vn` / `123456`.

### 3. How requests reach the backend
The app calls `/api` and `/socket.io` with **relative** URLs, so the browser only ever talks to one origin — no CORS preflight, and the `httpOnly` auth cookie just works.

| Environment | Who forwards `/api` and `/socket.io` | Target |
|---|---|---|
| `npm run dev` / `npm run preview` | Vite proxy (`vite.config.js`) | `VITE_BACKEND_TARGET`, default `http://localhost:3000` |
| Docker / production | nginx (`nginx.conf.template`) | `BACKEND_URL` container env var |

Do **not** set `VITE_API_BASE_URL` or `VITE_SOCKET_URL`: absolute URLs bypass the proxy, so the socket and cookies end up on a different origin.

### 4. Environment variables
All are public, browser-visible keys (see [`.env.example`](.env.example)). `VITE_*` values are baked into the bundle at build time — changing them requires a rebuild.

| Variable | Used for |
|---|---|
| `VITE_GG_CLIENT_ID` | Google login (must match `GG_CLIENT_ID` in fitlink-api) |
| `VITE_MAPTILER_KEY` | Map tiles |
| `VITE_GEOAPIFY_KEY` | Address search (PT location picker, booking location step) |
| `VITE_BACKEND_TARGET` | Optional. Backend URL for the Vite dev proxy |

### 5. Production build
```bash
npm run build     # output in dist/
npm run preview   # serves dist/ on http://localhost:4173, same proxy as dev
```

### 6. Docker
```bash
docker build -t fitlink-portal .
docker run -p 8080:80 -e BACKEND_URL=http://host.docker.internal:3000 fitlink-portal
# http://localhost:8080
```

To reach a backend started with `npm run dev`, set `APP_HOST=0.0.0.0` in fitlink-api's `.env` first. The default `localhost` makes Node listen on IPv6 `::1` only, and requests from the container fail with `502` (`connect() failed (111: Connection refused)` in the container log).

`nginx.conf.template` **is** the live nginx config: on container start the nginx entrypoint substitutes `${BACKEND_URL}` and writes `/etc/nginx/conf.d/default.conf`. `BACKEND_URL` is required.

### 7. Troubleshooting

| Symptom | Cause → fix |
|---|---|
| API calls return `500`, Vite terminal shows `[vite] http proxy error` / `ECONNREFUSED` | Backend is not running on `VITE_BACKEND_TARGET` (default port 3000) |
| Docker container returns `502` for `/api` | Backend listens on `localhost` only → set `APP_HOST=0.0.0.0` in fitlink-api's `.env` |
| Login works but chat and notifications never update | Socket is not reaching the backend — remove any `VITE_SOCKET_URL` / `VITE_API_URL` from `.env.local` |
| Container keeps restarting, log says `unknown "backend_url" variable` | `BACKEND_URL` was not passed to `docker run` |
| Changed a `VITE_*` value, the Docker image still uses the old one | Values are baked in at build time → rebuild the image |

---

## ⚡ Performance & Security Highlights

1. **Route-Level Code Splitting:** Over 42 application pages use `React.lazy` and `Suspense`, ensuring only necessary JavaScript chunks are downloaded for the active view.
2. **TanStack Query In-Memory Caching:** Instant transitions across pages (`staleTime: 5 min`) without redundant API queries.
3. **Anti-XSS Protection:** Notifications avoid `dangerouslySetInnerHTML` and strictly render safe JSX text nodes.
4. **HttpOnly Cookie Authentication:** API credentials are handled exclusively via secure cookies with `withCredentials: true`, preventing client script access to sensitive tokens.

## 🔐 Route Security Matrix

| Role | Accessible Routes |
|---|---|
| **Public / Guest** | `/home`, `/about`, `/news`, `/contact`, `/list-pt`, `/trainer/:id`, `/login`, `/register`, `/forgot-password` |
| **Student** | `/profile`, `/training-calendar`, `/my-packages`, `/chat`, `/chat-ai`, `/booking/:id`, `/payment/result`, `/notifications` |
| **Personal Trainer (PT)** | `/profile`, `/pt/dashboard`, `/pt/packages`, `/pt/schedule`, `/pt/students`, `/pt/wallet`, `/pt/materials`, `/pt/feedback`, `/pt/chat`, `/pt/approval-request` |
| **Admin** | `/admin`, `/admin/users`, `/admin/users/pts`, `/admin/users/students`, `/admin/payouts`, `/admin/pt-requests`, `/admin-transactions` |

