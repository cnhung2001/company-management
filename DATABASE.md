# Hướng dẫn sử dụng PostgreSQL với Docker

## Cài đặt và chạy PostgreSQL

1. Đảm bảo đã cài đặt Docker và Docker Compose trên máy

2. Chạy lệnh sau để khởi động PostgreSQL:

```bash
docker-compose up -d
```

3. Kiểm tra container đã chạy thành công:

```bash
docker ps
```

## Thông tin kết nối PostgreSQL

- **Host**: localhost
- **Port**: 5432
- **Username**: postgres
- **Password**: postgres
- **Database**: company_management

## Kết nối với PostgreSQL

### Sử dụng pgAdmin hoặc DBeaver

1. Mở pgAdmin hoặc DBeaver
2. Tạo kết nối mới với thông tin:
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: postgres
   - Database: company_management

### Sử dụng CLI

```bash
docker exec -it company-management-postgres psql -U postgres -d company_management
```

## Sử dụng trong ứng dụng NestJS

Đã cấu hình TypeORM trong app.module.ts để kết nối tới PostgreSQL. Để sử dụng trong các module:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YourEntity } from './entities/your.entity';

@Injectable()
export class YourService {
  constructor(
    @InjectRepository(YourEntity)
    private yourRepository: Repository<YourEntity>,
  ) {}

  // Các phương thức CRUD
}
```

Hoặc sử dụng DatabaseService:

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class YourService {
  constructor(private readonly databaseService: DatabaseService) {}

  async customQuery() {
    return this.databaseService.runQuery('SELECT * FROM your_table');
  }
}
```
