# 🚀 Hướng Dẫn Deploy Lên Vercel

## 📋 Yêu Cầu
- Tài khoản GitHub (để kết nối repository)
- Tài khoản Vercel (free)
- Vercel CLI (optional nhưng khuyến khích)

---

## 🔧 Bước 1: Chuẩn Bị API Configuration

### File `.env.production` đã có sẵn tại:
```
.env.production
```

**Các biến cần điền:**

```env
# API Configuration (thay thế URL của bạn)
VITE_API_BASE_URL=https://your-api-domain.com
VITE_WS_BASE_URL=wss://your-api-domain.com

# Mapbox Token (bắt buộc nếu dùng map)
VITE_MAPBOX_TOKEN=pk_your_production_mapbox_token

# Các biến khác (thường đã config)
VITE_USER_SERVICE_PREFIX=/user-service
VITE_CHAT_SERVICE_PREFIX=/chat-service
VITE_SOCIAL_SERVICE_PREFIX=/social-service
VITE_CHAT_WS_PATH=/ws-chat-notification
```

---

## 📱 Bước 2: Deploy Lên Vercel (Phương Pháp Dễ Nhất)

### 2.1 Qua Vercel Dashboard (Recommended)

1. **Truy cập Vercel**: https://vercel.com/
2. **Đăng ký/Đăng nhập** bằng GitHub
3. **Nhấp "New Project"**
4. **Chọn respository** từ GitHub:
   - Tìm `owlchat-frontend`
   - Nhấp Import
5. **Cấu hình Project**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Thêm Environment Variables** (Rất Quan Trọng!)
   - Nhấp "Environment Variables"
   - Thêm từng biến:
     - `VITE_API_BASE_URL` = https://your-api-domain.com
     - `VITE_WS_BASE_URL` = wss://your-api-domain.com
     - `VITE_MAPBOX_TOKEN` = pk_your_token
     - `VITE_USER_SERVICE_PREFIX` = /user-service
     - `VITE_CHAT_SERVICE_PREFIX` = /chat-service
     - `VITE_SOCIAL_SERVICE_PREFIX` = /social-service
     - `VITE_CHAT_WS_PATH` = /ws-chat-notification
     - `VITE_MAPBOX_STYLE` = mapbox://styles/mapbox/streets-v12
     - `VITE_MAP_CENTER_LNG` = 106.6837
     - `VITE_MAP_CENTER_LAT` = 10.7769
     - `VITE_MAP_ZOOM` = 9

7. **Nhấp "Deploy"**
8. ⏳ **Chờ build hoàn tất** (~2-5 phút)
9. ✅ **Lấy URL dự án**: Vercel sẽ cấp URL public

### 2.2 Qua Vercel CLI (Nếu Dùng Terminal)

```powershell
# Cài Vercel CLI
npm i -g vercel

# Login vào Vercel
vercel login

# Deploy
vercel --prod

# Lần đầu sẽ hỏi:
# - Project name: owlchat-frontend
# - Want to override existing project settings?: n
# - Which scope: (select your account)
```

---

## 🔐 Bước 3: Cấu Hình Environment Variables Trên Vercel

### Cách 1: Qua Dashboard

1. Vào **Settings** → **Environment Variables**
2. Thêm tất cả biến từ `.env.production`
3. Chọn môi trường: **Production** (hoặc Preview/Development nếu cần)

### Cách 2: Tự Động (Recommended)

Tạo file `.vercel/.env.production.local`:
```bash
# Thực thi lệnh này trong repo
vercel env pull .env.production.local
```

Sau đó edit file và push lên, Vercel sẽ tự động nhận cấu hình.

---

## 📝 Live Environment Variables (Nếu Cần Thay Đổi Nhanh)

Để cập nhật biến mà không rebuild:

1. Vào **Settings** → **Environment Variables**
2. Chỉnh sửa giá trị
3. Nhấp **Save**
4. Vào **Deployments** → Chọn deployment hiện tại
5. Nhấp **Redeploy** hoặc **Promote to Production**

---

## ✅ Kiểm Tra Deployment

### 1. Kiểm Tra Build
- Đi tới **Deployments** tab
- Xem logs (phải thành công - status ✓)

### 2. Kiểm Tra Environment Variables
- **Settings** → **Environment Variables**
- Xác nhận tất cả biến đã được thêm

### 3. Kiểm Tra Ứng Dụng
- Truy cập URL dự án Vercel
- Mở **DevTools** (F12)
- Kiểm tra **Console** có lỗi không
- Test các tính năng (map, API calls)

---

## 🐛 Troubleshooting

### ❌ "VITE_MAPBOX_TOKEN is empty"
**Giải pháp**:
- Kiểm tra Vercel Environment Variables
- Đảm bảo token có format đúng: `pk_...`
- Rebuild deployment

### ❌ "API calls fail / 404 errors"
**Giải pháp**:
- Kiểm tra `VITE_API_BASE_URL` đúng không
- Kiểm tra backend API có hoạt động không
- CORS configuration trên backend

### ❌ "WebSocket connection fails"
**Giải pháp**:
- Đảm bảo `VITE_WS_BASE_URL` sử dụng `wss://` (secure)
- Backend WebSocket phải hỗ trợ WSS
- Kiểm tra firewall/proxy

### ❌ Build fail
**Kiểm tra**:
- Logs trên Vercel Dashboard
- Xem **Build Logs** tab
- Thường là do missing env vars

---

## 📊 Cấu Trúc Environment Variables

### Development (`npm run dev`)
- Sử dụng `.env.local`
- API: `http://localhost:8080` (local backend)

### Production (`vercel --prod`)
- Sử dụng `.env.production` + Vercel Environment Variables
- API: Production backend domain

### Preview (Branch deployment)
- Tự động từ Vercel
- Có thể override trong Settings

---

## 🔄 CI/CD Pipeline (Automatic)

Mỗi khi bạn push lên GitHub:

1. Vercel tự động detect push
2. Build project
3. Deploy nếu build thành công
4. Tạo URL preview cho PRs

**Không cần làm gì thêm!** 🎉

---

## 📚 Tài Liệu Thêm

- [Vercel Docs](https://vercel.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 💡 Tips

✅ **Best Practices:**
- Luôn commit `.env.production` và `vercel.json` (không chứa secrets)
- Sử dụng Vercel Dashboard để quản lý secrets
- Tạo separate environment cho staging/production
- Monitor logs sau deployment

🚫 **Tránh:**
- Đừng commit `.env.local` hoặc `.env.*.local`
- Đừng hardcode API URLs trong code
- Đừng chia sẻ tokens công khai

---

**Cần trợ giúp?** Hãy kiểm tra logs trên Vercel Dashboard! 🔍
