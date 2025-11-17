import { 
  Entity, 
  Column,
  OneToMany
} from 'typeorm';
import { BaseEntity } from './base.entity';

// Sử dụng type để tránh circular dependency
type Department = any;

@Entity('companies')
export class Company extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany('Department', 'company')
  departments: Department[];
}