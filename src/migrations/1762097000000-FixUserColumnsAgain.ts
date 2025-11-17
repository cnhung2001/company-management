import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserColumnsAgain1762097000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Kiểm tra xem cột is_active có tồn tại không
        const isActiveExists = await queryRunner.hasColumn('users', 'is_active');
        if (!isActiveExists) {
            await queryRunner.query(`
                ALTER TABLE "users"
                ADD COLUMN "is_active" boolean NOT NULL DEFAULT true
            `);
            console.log('Added is_active column to users table');
        }

        // Kiểm tra xem cột is_first_login có tồn tại không
        const isFirstLoginExists = await queryRunner.hasColumn('users', 'is_first_login');
        if (!isFirstLoginExists) {
            await queryRunner.query(`
                ALTER TABLE "users"
                ADD COLUMN "is_first_login" boolean NOT NULL DEFAULT false
            `);
            console.log('Added is_first_login column to users table');
        }

        // Kiểm tra xem cột username có tồn tại không
        const usernameExists = await queryRunner.hasColumn('users', 'username');
        if (!usernameExists) {
            await queryRunner.query(`
                ALTER TABLE "users"
                ADD COLUMN "username" character varying UNIQUE
            `);
            console.log('Added username column to users table');
        }

        // Cập nhật các bản ghi hiện có để đảm bảo có giá trị cho các cột mới
        await queryRunner.query(`
            UPDATE "users"
            SET "is_active" = true
            WHERE "is_active" IS NULL
        `);
        console.log('Updated null is_active values to true');

        await queryRunner.query(`
            UPDATE "users"
            SET "is_first_login" = false
            WHERE "is_first_login" IS NULL
        `);
        console.log('Updated null is_first_login values to false');

        // Đảm bảo email có thể null
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "email" DROP NOT NULL
        `);
        console.log('Made email column nullable');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Không cần rollback vì đây là fix cho cấu trúc bảng
    }
}
