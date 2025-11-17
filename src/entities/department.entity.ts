import { 
  Entity, 
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { BaseEntity } from './base.entity';

// Sử dụng type để tránh circular dependency
type Company = any;
type Employee = any;

@Entity('departments')
export class Department extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'company_id', nullable: true })
  companyId: string;

  @ManyToOne('Company', 'departments')
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany('Employee', 'department')
  employees: Employee[];
}