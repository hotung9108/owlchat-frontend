# Cấu Hình API Map (Mapbox)

## 📍 Cách Lấy Mapbox Token

### Bước 1: Tạo Tài Khoản Mapbox
1. Truy cập [https://www.mapbox.com](https://www.mapbox.com)
2. Nhấp vào **Sign Up** 
3. Điền thông tin tài khoản và xác nhận email

### Bước 2: Lấy Access Token
1. Đăng nhập vào tài khoản Mapbox
2. Vào trang **Tokens** (https://account.mapbox.com/tokens/)
3. Tìm mục **Default public token** (hoặc tạo token mới)
4. Sao chép token này

### Bước 3: Cấu Hình Ứng Dụng

#### Phương Pháp 1: Sử Dụng File `.env.local` (Khuyến Nghị)

1. Mở file `.env.local` trong thư mục gốc dự án
2. Tìm dòng: `VITE_MAPBOX_TOKEN=`
3. Dán token Mapbox vào: `VITE_MAPBOX_TOKEN=pk_your_token_here`
4. Lưu file

```env
# Example
VITE_MAPBOX_TOKEN=pk_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Phương Pháp 2: Biến Môi Trường Hệ Thống

Bạn cũng có thể thiết lập biến môi trường toàn hệ thống:

**Windows (PowerShell):**
```powershell
$env:VITE_MAPBOX_TOKEN='pk_your_token_here'
```

**Linux/macOS:**
```bash
export VITE_MAPBOX_TOKEN='pk_your_token_here'
```

## 🗺️ Các Biến Cấu Hình Mapbox

| Biến | Mô Tả | Giá Trị Mặc Định |
|------|-------|-----------------|
| `VITE_MAPBOX_TOKEN` | Access token từ Mapbox | (trống) |
| `VITE_MAPBOX_STYLE` | Style của bản đồ | `mapbox://styles/mapbox/streets-v12` |
| `VITE_MAP_CENTER_LNG` | Kinh độ - Tọa độ ban đầu | `106.6837` (TP.HCM) |
| `VITE_MAP_CENTER_LAT` | Vĩ độ - Tọa độ ban đầu | `10.7769` (TP.HCM) |
| `VITE_MAP_ZOOM` | Mức zoom ban đầu | `9` |

## 🎨 Các Style Mapbox Khác

- `mapbox://styles/mapbox/streets-v12` - Street Map (Mặc định)
- `mapbox://styles/mapbox/outdoors-v12` - Outdoor Map
- `mapbox://styles/mapbox/light-v11` - Light Map
- `mapbox://styles/mapbox/dark-v11` - Dark Map
- `mapbox://styles/mapbox/satellite-v9` - Satellite
- `mapbox://styles/mapbox/satellite-streets-v12` - Satellite Streets

## 📍 Thay Đổi Tọa Độ Trung Tâm

Để thay đổi vị trí bản đồ khởi động, chỉnh sửa các biến:

```env
# Hà Nội
VITE_MAP_CENTER_LNG=105.8342
VITE_MAP_CENTER_LAT=21.0285

# Đà Nẵng
VITE_MAP_CENTER_LNG=107.0674
VITE_MAP_CENTER_LAT=15.8754

# Cần Thơ
VITE_MAP_CENTER_LNG=105.7581
VITE_MAP_CENTER_LAT=10.0379
```

## ✅ Kiểm Tra Cấu Hình

Sau khi cấu hình, hãy kiểm tra xem bản đồ có hoạt động đúng:

1. Chạy ứng dụng: `npm run dev`
2. Trang có chứa bản đồ sẽ hiển thị Mapbox
3. Nếu thấy lỗi hoặc bản đồ trắng, kiểm tra:
   - Token có đúng không
   - Token có bị hết hạn không
   - Có internet connection không

## 🔒 Lưu Ý Bảo Mật

⚠️ **QUAN TRỌNG**: Không nên commit file `.env.local` lên Git!

File `.gitignore` đã được cấu hình để bỏ qua `.env.local`.

---

**Cần trợ giúp?** Xem thêm tài liệu Mapbox: https://docs.mapbox.com/
