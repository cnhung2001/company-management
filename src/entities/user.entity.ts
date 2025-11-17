import { 
  Entity, 
  Column,
  OneToOne
} from 'typeorm';
import { BaseEntity } from './base.entity';

// Sử dụng type để tránh circular dependency
type Employee = any;

export enum UserRole {
  EMPLOYEE = 'employee',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_first_login', default: false })
  isFirstLogin: boolean;

  @OneToOne('Employee', 'user')
  employee: Employee;
}