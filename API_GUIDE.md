# API Documentation Guide

## Swagger UI

Swagger UI đã được cấu hình cho dự án này để giúp bạn dễ dàng khám phá và thử nghiệm các API.

### Truy cập Swagger UI

Sau khi khởi động ứng dụng, bạn có thể truy cập Swagger UI tại:

```
http://localhost:8000/api/docs
```

Hoặc nếu bạn đã cấu hình PORT khác trong biến môi trường:

```
http://localhost:{PORT}/api/docs
```

### Sử dụng Swagger UI

1. **Xem tài liệu API**: Tất cả các API endpoints đều được liệt kê với mô tả, tham số và các phản hồi có thể.

2. **Thử nghiệm API**: 
   - Chọn một endpoint
   - Nhấp vào "Try it out"
   - Điền các tham số cần thiết
   - Nhấp vào "Execute" để gửi request

3. **Xác thực**:
   - Đối với các API yêu cầu xác thực, trước tiên hãy gọi endpoint `/auth/login` để lấy token
   - Nhấp vào nút "Authorize" ở góc trên bên phải
   - Nhập token theo định dạng: `Bearer {your_token}`
   - Nhấp vào "Authorize" để lưu token

### Các nhóm API

Các API đã được nhóm lại để dễ dàng điều hướng:

1. **Authentication**: Đăng nhập, đổi mật khẩu, quản lý người dùng

## Lưu ý quan trọng

- Swagger UI chỉ nên được bật trong môi trường phát triển và thử nghiệm
- Trong môi trường sản xuất, bạn nên tắt Swagger UI hoặc giới hạn quyền truy cập vào nó