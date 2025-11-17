import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  Get,
  InternalServerErrorException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, ChangePasswordDto, CreateUserDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { Roles } from './decorators/roles.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Đăng nhập thành công, trả về access token' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Thông tin đăng nhập không chính xác' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Đăng nhập thất bại do lỗi server' 
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log('Login endpoint called with username:', loginDto.username);
      const result = await this.authService.login(loginDto);
      console.log('Login successful for user:', loginDto.username);
      return result;
    } catch (error) {
      console.error('Error in login controller:', error);
      if (error.status) {
        throw error; // Rethrow NestJS exceptions
      }
      throw new InternalServerErrorException('Đăng nhập thất bại. Vui lòng thử lại sau.');
    }
  }

  @ApiOperation({ summary: 'Đổi mật khẩu người dùng' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'Đổi mật khẩu thành công' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Không có quyền truy cập (token không hợp lệ)' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Mật khẩu cũ không chính xác hoặc mật khẩu mới không hợp lệ' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Đổi mật khẩu thất bại do lỗi server' 
  })
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      return await this.authService.changePassword(userId, changePasswordDto);
    } catch (error) {
      console.error('Error in changePassword controller:', error);
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException('Đổi mật khẩu thất bại. Vui lòng thử lại sau.');
    }
  }

  @ApiOperation({ summary: 'Tạo người dùng mới (chỉ dành cho Admin và Super Admin)' })
  @ApiBody({ type: CreateUserDto })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo người dùng thành công' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Không có quyền truy cập (token không hợp lệ)' 
  })
  @ApiForbiddenResponse({ 
    description: 'Không đủ quyền để thực hiện hành động này' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ hoặc tên đăng nhập/email đã tồn tại' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Tạo người dùng thất bại do lỗi server' 
  })
  @Post('admin/create-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async createUser(
    @GetUser('id') adminId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      return await this.authService.createUser(createUserDto, adminId);
    } catch (error) {
      console.error('Error in createUser controller:', error);
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException('Tạo người dùng thất bại. Vui lòng thử lại sau.');
    }
  }
  
  @ApiOperation({ summary: 'Lấy thông tin cá nhân của người dùng đăng nhập' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy thông tin người dùng thành công' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Không có quyền truy cập (token không hợp lệ)' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lấy thông tin người dùng thất bại do lỗi server' 
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user) {
    try {
      return await this.authService.getProfile(user.id);
    } catch (error) {
      console.error('Error in getProfile controller:', error);
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.');
    }
  }
  
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng (chỉ dành cho Super Admin)' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy danh sách người dùng thành công' 
  })
  @ApiUnauthorizedResponse({ 
    description: 'Không có quyền truy cập (token không hợp lệ)' 
  })
  @ApiForbiddenResponse({ 
    description: 'Không đủ quyền để thực hiện hành động này (chỉ Super Admin mới có quyền)' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Lấy danh sách người dùng thất bại do lỗi server' 
  })
  @Get('super-admin/users')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async getAllUsers() {
    try {
      return await this.authService.getAllUsers();
    } catch (error) {
      console.error('Error in getAllUsers controller:', error);
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException('Không thể lấy danh sách người dùng. Vui lòng thử lại sau.');
    }
  }
}
