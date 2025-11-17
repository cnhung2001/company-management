import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserColumns1762095500000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Kiểm tra xem cột is_active có tồn tại không
        const isActiveExists = await queryRunner.hasColumn('users', 'is_active');
        if (!isActiveExists) {
            await queryRunner.query(`
                ALTER TABLE "users"
                ADD COLUMN "is_active" boolean NOT NULL DEFAULT true
            `);
        }

        // Kiểm tra xem cột is_first_login có tồn tại không
        const isFirstLoginExists = await queryRunner.hasColumn('users', 'is_first_login');
        if (!isFirstLoginExists) {
            await queryRunner.query(`
                ALTER TABLE "users"
                ADD COLUMN "is_first_login" boolean NOT NULL DEFAULT false
            `);
        }

        // Kiểm tra xem cột username có tồn tại không
        const usernameExists = await queryRunner.hasColumn('users', 'username');
        if (!usernameExists) {
            await queryRunner.query(`
                ALTER TABLE "users"
                ADD COLUMN "username" character varying UNIQUE
            `);
        }

        // Đảm bảo email có thể null
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "email" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Không cần rollback vì đây là fix cho cấu trúc bảng
    }
}
