import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../../entities/user.entity';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('Chỉ Super Admin mới có quyền truy cập tính năng này');
    }
    
    return true;
  }
}
