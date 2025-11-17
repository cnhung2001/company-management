import { 
  Entity, 
  Column,
  OneToMany
} from 'typeorm';
import { BaseEntity } from './base.entity';

// Sử dụng type để tránh circular dependency
type Employee = any;

@Entity('positions')
export class Position extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  level: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany('Employee', 'position')
  employees: Employee[];
}