# Cập nhật hướng dẫn khắc phục lỗi

## Lỗi "Cannot convert undefined or null to object"

### Các thay đổi mới đã thực hiện

1. **Thêm logs chi tiết**
   - Đã thêm logs chi tiết trong các phương thức của AuthService để dễ dàng xác định vị trí lỗi
   - Logs bao gồm thông tin về quá trình xác thực người dùng, tạo JWT token và phản hồi

2. **Cải thiện xử lý lỗi**
   - Đã cập nhật AuthController để xử lý lỗi tốt hơn với try-catch blocks
   - Đã thêm InternalServerErrorException để xử lý các lỗi không xác định

3. **Cập nhật cấu trúc database**
   - Đã tạo migration mới (FixUserColumnsAgain) để đảm bảo các cột cần thiết tồn tại
   - Đã cập nhật các giá trị NULL trong cột is_active và is_first_login
   - Đã đảm bảo cột email có thể nhận giá trị NULL

4. **Cải thiện xử lý giá trị mặc định**
   - Đã sử dụng giá trị mặc định cố định thay vì dựa vào giá trị có thể không tồn tại
   - Đã thay thế cách tiếp cận destructuring bằng việc tạo đối tượng mới

## Hướng dẫn khởi động lại ứng dụng

1. Dừng server hiện tại (Ctrl+C)
2. Khởi động lại server:
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

## Nếu vẫn gặp lỗi

Nếu vẫn gặp lỗi sau khi thực hiện các bước trên, hãy thử các giải pháp sau:

1. **Kiểm tra logs server**
   - Xem logs server để tìm thông tin chi tiết về lỗi
   - Các logs đã được thêm vào sẽ giúp xác định chính xác vị trí lỗi

2. **Kiểm tra dữ liệu trong database**
   - Kiểm tra xem tài khoản admin đã được tạo đúng chưa
   - Kiểm tra các cột is_active và is_first_login có giá trị hợp lệ không

3. **Tạo lại tài khoản admin**
   - Xóa tài khoản admin hiện tại (nếu có)
   - Chạy lại migration để tạo tài khoản admin mới

4. **Kiểm tra cấu hình JWT**
   - Đảm bảo JWT_SECRET được cấu hình đúng trong file .env
   - Kiểm tra thời hạn token (JWT_EXPIRATION) có hợp lệ không

5. **Kiểm tra các dependency**
   - Chạy `npm install` để đảm bảo tất cả các dependency đã được cài đặt đúng
   - Kiểm tra phiên bản của các package quan trọng như @nestjs/jwt, passport-jwt
