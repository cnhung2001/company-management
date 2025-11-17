import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'super-secret-key',
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: payload.sub }
      });

      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      // Kiểm tra isActive tồn tại trước khi sử dụng
      if (user.isActive === false) {
        throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
      }

      return {
        id: payload.sub,
        username: payload.username,
        role: payload.role
      };
    } catch (error) {
      console.error('Lỗi trong JWT validate:', error);
      throw new UnauthorizedException('Xác thực thất bại');
    }
  }
}
