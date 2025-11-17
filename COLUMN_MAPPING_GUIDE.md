# Hướng dẫn xử lý vấn đề mapping giữa Entity và Database

## Vấn đề

Trong TypeORM, khi tên thuộc tính trong Entity không khớp với tên cột trong database, bạn cần sử dụng tùy chọn `name` trong decorator `@Column` để chỉ định tên cột tương ứng trong database.

Lỗi `column User.isActive does not exist` xảy ra vì:
- Trong Entity, chúng ta sử dụng `isActive` (camelCase)
- Nhưng trong database, cột được đặt tên là `is_active` (snake_case)

## Giải pháp

1. **Sử dụng tùy chọn `name` trong decorator `@Column`**

```typescript
// Thay vì
@Column({ default: true })
isActive: boolean;

// Sử dụng
@Column({ name: 'is_active', default: true })
isActive: boolean;
```

2. **Áp dụng cho tất cả các thuộc tính camelCase**

Các thuộc tính camelCase khác cũng cần được áp dụng tương tự:

```typescript
@Column({ name: 'full_name' })
fullName: string;

@Column({ name: 'is_first_login' })
isFirstLogin: boolean;
```

## Các thay đổi đã thực hiện

Trong file `src/entities/user.entity.ts`, chúng ta đã thêm mapping cho các thuộc tính sau:

1. `fullName` -> `full_name`
2. `isActive` -> `is_active`
3. `isFirstLogin` -> `is_first_login`

## Cách kiểm tra tên cột trong database

Để xem tên cột chính xác trong database, bạn có thể sử dụng câu lệnh SQL:

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'users';
```

## Quy ước đặt tên

- **TypeScript/JavaScript**: Sử dụng camelCase cho tên thuộc tính
- **Database**: Sử dụng snake_case cho tên cột

## Lưu ý quan trọng

1. **Tính nhất quán**: Luôn đảm bảo tính nhất quán trong việc đặt tên và mapping
2. **Kiểm tra kỹ**: Khi gặp lỗi liên quan đến cột không tồn tại, kiểm tra tên cột trong database
3. **Tự động hóa**: Có thể cấu hình TypeORM để tự động chuyển đổi camelCase sang snake_case bằng cách sử dụng `namingStrategy`

## Cấu hình NamingStrategy (Tùy chọn)

Thay vì phải chỉ định `name` cho từng cột, bạn có thể cấu hình TypeORM để tự động chuyển đổi camelCase sang snake_case:

```typescript
// typeorm.config.ts
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default {
  // ...các cấu hình khác
  namingStrategy: new SnakeNamingStrategy()
}
```

Để sử dụng cấu hình này, bạn cần cài đặt package `typeorm-naming-strategies`:

```bash
npm install typeorm-naming-strategies
```
