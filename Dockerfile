# ================================================================
# STAGE 1: Tầng đóng gói (Compile React Vite thành các file tĩnh)
# ================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy file định nghĩa thư viện trước để tận dụng Docker Cache
COPY package*.json ./

# Cài đặt thư viện
RUN npm ci --no-audit

# Copy toàn bộ mã nguồn Frontend vào
COPY . .

# Chạy lệnh build của Vite để tạo ra thư mục dist/
RUN npm run build

# ================================================================
# STAGE 2: Tầng vận hành (Web Server Nginx Alpine siêu tí hon ~25MB)
# ================================================================
FROM nginx:alpine AS runner

# Xóa trang mặc định chào mừng của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy file cấu hình Nginx của chúng ta vào thư mục cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Bốc thư mục dist/ từ Tầng 1 sang thư mục phục vụ web của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Mở cổng 80 cho web
EXPOSE 80

# Tự động kiểm tra sức khỏe Nginx định kỳ 30s
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

# Khởi động Nginx ở chế độ chạy nền
CMD ["nginx", "-g", "daemon off;"]