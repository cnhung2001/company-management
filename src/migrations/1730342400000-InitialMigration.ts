import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1730342400000 implements MigrationInterface {
    name = 'InitialMigration1730342400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tạo bảng companies
        await queryRunner.query(`
            CREATE TABLE "companies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(100) NOT NULL,
                "address" character varying,
                "phone" character varying,
                "email" character varying,
                "website" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_companies" PRIMARY KEY ("id")
            )
        `);

        // Tạo bảng departments
        await queryRunner.query(`
            CREATE TABLE "departments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(100) NOT NULL,
                "description" character varying,
                "company_id" uuid,
                CONSTRAINT "PK_departments" PRIMARY KEY ("id")
            )
        `);

        // Tạo bảng positions
        await queryRunner.query(`
            CREATE TABLE "positions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(100) NOT NULL,
                "description" character varying,
                "level" integer,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_positions" PRIMARY KEY ("id")
            )
        `);

        // Tạo bảng users
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "full_name" character varying(100) NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'employee',
                "is_active" boolean NOT NULL DEFAULT true,
                "is_first_login" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        // Tạo bảng employees
        await queryRunner.query(`
            CREATE TABLE "employees" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "full_name" character varying(100) NOT NULL,
                "email" character varying,
                "phone" character varying,
                "date_of_birth" date,
                "hire_date" date,
                "department_id" uuid,
                "position_id" uuid,
                "user_id" uuid,
                CONSTRAINT "UQ_employees_user_id" UNIQUE ("user_id"),
                CONSTRAINT "PK_employees" PRIMARY KEY ("id")
            )
        `);

        // Tạo các khóa ngoại
        await queryRunner.query(`
            ALTER TABLE "departments"
            ADD CONSTRAINT "FK_departments_companies"
            FOREIGN KEY ("company_id")
            REFERENCES "companies"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_employees_departments"
            FOREIGN KEY ("department_id")
            REFERENCES "departments"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_employees_positions"
            FOREIGN KEY ("position_id")
            REFERENCES "positions"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "employees"
            ADD CONSTRAINT "FK_employees_users"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

        // Tạo extension uuid-ossp nếu chưa có
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Xóa các khóa ngoại
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_employees_users"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_employees_positions"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_employees_departments"`);
        await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT "FK_departments_companies"`);

        // Xóa các bảng
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "positions"`);
        await queryRunner.query(`DROP TABLE "departments"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }
}


