# Hướng dẫn khắc phục lỗi

## Lỗi "Cannot convert undefined or null to object"

### Nguyên nhân
Lỗi này xảy ra khi code cố gắng sử dụng destructuring assignment (`const { ... } = object`) trên một đối tượng là `null` hoặc `undefined`. Trong trường hợp này, lỗi xuất hiện khi API đăng nhập cố gắng truy cập các thuộc tính của đối tượng user nhưng một số trường không tồn tại trong database.

### Giải pháp
1. Đã sửa đổi code để kiểm tra và xử lý các trường hợp khi thuộc tính có thể là `null` hoặc `undefined`
2. Thay vì sử dụng destructuring trực tiếp, tạo đối tượng mới với các giá trị mặc định
3. Thêm try-catch để bắt và xử lý lỗi một cách an toàn

### Các thay đổi đã thực hiện
1. Trong `validateUser()`:
   - Thêm try-catch để bắt lỗi
   - Kiểm tra `isActive` trước khi sử dụng
   - Tạo đối tượng result mới thay vì destructuring

2. Trong `login()`:
   - Thêm try-catch để bắt lỗi
   - Thêm giá trị mặc định cho `isFirstLogin`

3. Trong các phương thức khác:
   - Áp dụng cách tiếp cận tương tự để tránh lỗi khi truy cập thuộc tính

## Lỗi "column User.isActive does not exist"

### Nguyên nhân
Lỗi này xảy ra khi entity User có trường `isActive` nhưng bảng `users` trong database không có cột tương ứng.

### Giải pháp
1. Đã tạo migration mới để thêm các cột còn thiếu vào bảng `users`:
   - `is_active`: Trạng thái hoạt động của tài khoản
   - `is_first_login`: Kiểm tra đăng nhập lần đầu
   - `username`: Tên đăng nhập (nếu chưa có)

2. Đã chạy migration để cập nhật cấu trúc bảng

## Các lỗi khác có thể gặp

### 1. Lỗi JWT không hợp lệ
- **Nguyên nhân**: JWT secret không khớp hoặc token hết hạn
- **Giải pháp**: Kiểm tra JWT_SECRET trong file .env và đảm bảo nó khớp với cấu hình

### 2. Lỗi kết nối database
- **Nguyên nhân**: Thông tin kết nối database không chính xác
- **Giải pháp**: Kiểm tra thông tin kết nối trong file .env

### 3. Lỗi "Cannot find module"
- **Nguyên nhân**: Thiếu package hoặc import sai đường dẫn
- **Giải pháp**: Chạy `npm install` để cài đặt các package còn thiếu

## Cách khởi động lại ứng dụng sau khi sửa lỗi

1. Dừng server hiện tại (Ctrl+C)
2. Biên dịch lại ứng dụng:
   ```bash
   npm run build
   ```
3. Khởi động lại server:
   ```bash
   npm run start:dev
   ```

## Kiểm tra API đăng nhập

```bash
curl --location 'http://localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "username": "admin",
  "password": "Admin@123"
}'
```

Hoặc sử dụng PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"username": "admin", "password": "Admin@123"}'
```
