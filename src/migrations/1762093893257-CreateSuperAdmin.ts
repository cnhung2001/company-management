import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';
// Khai báo kiểu cho uuid
import type { v4 } from 'uuid';

export class CreateSuperAdmin1762093893257 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Thêm cột username vào bảng users
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "username" character varying UNIQUE
        `);

        // Tạo salt và hash mật khẩu
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash('Admin@123', salt);
        
        // Tạo ID bằng cách sử dụng dynamic import
        const { v4: uuidv4 } = await import('uuid');
        const id = uuidv4();
        
        // Thời gian hiện tại
        const now = new Date();
        
        // Thêm tài khoản super admin
        await queryRunner.query(`
            INSERT INTO users (
                id, 
                full_name, 
                email, 
                username,
                password, 
                role, 
                is_active, 
                is_first_login, 
                created_at, 
                updated_at
            ) VALUES (
                '${id}', 
                'Super Admin', 
                'admin@company.com', 
                'admin',
                '${password}', 
                'super_admin', 
                true, 
                false, 
                '${now.toISOString()}', 
                '${now.toISOString()}'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Xóa tài khoản super admin
        await queryRunner.query(`
            DELETE FROM users 
            WHERE username = 'admin' AND email = 'admin@company.com'
        `);
        
        // Xóa cột username khỏi bảng users
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "username"
        `);
    }
}
