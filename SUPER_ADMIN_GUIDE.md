# Hướng dẫn sử dụng tài khoản Super Admin

## Thông tin tài khoản Super Admin mặc định

Hệ thống đã được tạo sẵn một tài khoản Super Admin với thông tin như sau:

- **Username:** admin
- **Password:** Admin@123
- **Email:** admin@company.com
- **Role:** super_admin

## Chạy migration để tạo tài khoản Super Admin

Để tạo tài khoản Super Admin mặc định, bạn cần chạy migration:

```bash
npm run migration:run
```

## Đăng nhập với tài khoản Super Admin

### Endpoint

```
POST /auth/login
```

### Request body

```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

### Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-của-user",
    "username": "admin",
    "role": "super_admin",
    "isFirstLogin": false
  }
}
```

## Các quyền của Super Admin

Tài khoản Super Admin có các quyền sau:

1. Tạo tài khoản cho Admin và Employee
2. Xem danh sách tất cả người dùng trong hệ thống
3. Quản lý toàn bộ hệ thống

## API dành riêng cho Super Admin

### 1. Xem danh sách tất cả người dùng

```
GET /auth/super-admin/users
```

**Headers:**
```
Authorization: Bearer <access_token>
```

### 2. Tạo tài khoản mới

```
POST /auth/admin/create-user
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request body:**
```json
{
  "fullName": "Tên người dùng",
  "email": "email@example.com",
  "username": "username",
  "password": "password",
  "role": "admin" // hoặc "employee"
}
```

## Lưu ý bảo mật

- Đổi mật khẩu tài khoản Super Admin mặc định ngay sau khi đăng nhập lần đầu
- Hạn chế chia sẻ thông tin đăng nhập của tài khoản Super Admin
- Chỉ sử dụng tài khoản Super Admin khi thực sự cần thiết
