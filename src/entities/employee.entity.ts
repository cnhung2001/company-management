import { 
  Entity, 
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { BaseEntity } from './base.entity';

// Sử dụng type để tránh circular dependency
type Department = any;
type Position = any;
type User = any;

@Entity('employees')
export class Employee extends BaseEntity {
  @Column({ length: 100 })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'date', nullable: true })
  hireDate: Date;

  @Column({ name: 'department_id', nullable: true })
  departmentId: string;

  @ManyToOne('Department', 'employees')
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ name: 'position_id', nullable: true })
  positionId: string;

  @ManyToOne('Position', 'employees')
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column({ name: 'user_id', nullable: true, unique: true })
  userId: string;

  @OneToOne('User')
  @JoinColumn({ name: 'user_id' })
  user: User;
}