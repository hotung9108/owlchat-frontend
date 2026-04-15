# ⚡ Quick API Configuration Reference

## 🎯 Nơi Điền API Configuration

### Local Development (`.env.local`)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080
VITE_MAPBOX_TOKEN=pk_your_local_token
```

### Production (`.env.production`)
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_WS_BASE_URL=wss://your-api-domain.com
VITE_MAPBOX_TOKEN=pk_your_production_token
```

### Vercel Dashboard
**Settings → Environment Variables** - Thêm các biến production

---

## 🔑 API Key/Token cần chuẩn bị

| Key | Nơi Lấy | Format |
|-----|---------|--------|
| **Mapbox Token** | mapbox.com account | `pk_...` |
| **API Base URL** | Backend service | `https://...` |
| **WS Base URL** | Backend WebSocket | `wss://...` |

---

## 📋 Tất Cả Biến Environment

```env
# API Endpoints
VITE_API_BASE_URL=
VITE_USER_SERVICE_PREFIX=/user-service
VITE_CHAT_SERVICE_PREFIX=/chat-service
VITE_SOCIAL_SERVICE_PREFIX=/social-service

# WebSocket
VITE_WS_BASE_URL=
VITE_CHAT_WS_PATH=/ws-chat-notification

# Mapbox (nếu dùng map)
VITE_MAPBOX_TOKEN=
VITE_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
VITE_MAP_CENTER_LNG=106.6837
VITE_MAP_CENTER_LAT=10.7769
VITE_MAP_ZOOM=9
```

---

## 🚀 Deploy Steps Summary

1. **Sửa `.env.production`** - Điền API URLs
2. **Push to GitHub**
3. **Vercel Deploy**:
   - Vào vercel.com
   - Import repo
   - Thêm Environment Variables
   - Deploy!
4. **Done!** ✅

---

## 🔗 Các Resources

- **Vercel Deployment**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Mapbox Setup**: [MAPBOX_SETUP.md](MAPBOX_SETUP.md)
- **Env Example**: [.env.example](.env.example)
