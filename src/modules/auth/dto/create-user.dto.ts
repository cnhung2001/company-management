import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Họ và tên đầy đủ của người dùng',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Địa chỉ email của người dùng',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Tên đăng nhập của người dùng',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Mật khẩu của người dùng',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'Vai trò của người dùng',
    enum: UserRole,
    example: UserRole.EMPLOYEE,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
