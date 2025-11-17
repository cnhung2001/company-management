# Hướng dẫn cài đặt và khởi động Docker Desktop

## Lỗi khi chạy docker-compose

Lỗi `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified` xuất hiện khi Docker Desktop chưa được khởi động hoặc không hoạt động đúng cách.

## Các bước khắc phục

### 1. Khởi động Docker Desktop

- Nhấn phím **Windows**, gõ "Docker Desktop" và mở ứng dụng
- Chờ đến khi Docker Desktop hiển thị trạng thái "Docker is running"
- Biểu tượng Docker ở thanh taskbar sẽ ngừng xoay khi đã sẵn sàng

### 2. Kiểm tra và khởi động lại dịch vụ Docker (nếu cần)

Nếu Docker Desktop không khởi động được:

- Nhấn tổ hợp phím **Ctrl + Shift + Esc** để mở **Task Manager**
- Tìm và kết thúc các tiến trình sau nếu chúng đang chạy:
  - Docker Desktop
  - Docker Desktop Service
  - vmmem (nếu có)
- Sau đó, mở lại Docker Desktop và chờ đến khi nó hoạt động bình thường

### 3. Xác nhận Docker đang hoạt động

- Mở **Command Prompt** hoặc **PowerShell**
- Chạy lệnh sau để kiểm tra:
```powershell
docker info
```

### 4. Chạy lại docker-compose

Sau khi Docker Desktop đã hoạt động:
```powershell
docker-compose up -d
```

## Cài đặt Docker Desktop (nếu chưa cài đặt)

1. Tải Docker Desktop từ trang chủ: https://www.docker.com/products/docker-desktop/
2. Cài đặt theo hướng dẫn
3. Khởi động Docker Desktop sau khi cài đặt xong
4. Đảm bảo WSL 2 đã được cài đặt và cấu hình đúng (Windows 10/11)

## Kiểm tra kết nối PostgreSQL sau khi chạy container

Sau khi container PostgreSQL đã chạy thành công:

```powershell
# Kiểm tra container đang chạy
docker ps

# Kết nối với PostgreSQL trong container
docker exec -it company-management-postgres psql -U postgres -d company_management
```
