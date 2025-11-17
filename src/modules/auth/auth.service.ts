import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../entities/user.entity';
import { LoginDto, ChangePasswordDto, CreateUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      console.log('Validating user with username:', username);
      
      const user = await this.userRepository.findOne({ 
        where: { username },
        select: ['id', 'username', 'password', 'role', 'isActive', 'isFirstLogin'] 
      });

      console.log('User found:', user ? 'yes' : 'no');
      
      if (!user) {
        throw new UnauthorizedException('Tên đăng nhập không tồn tại');
      }

      console.log('User data:', JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        isFirstLogin: user.isFirstLogin
      }));

      // Kiểm tra isActive tồn tại trước khi sử dụng
      if (user.isActive === false) {
        throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
      }

      console.log('Comparing passwords');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid ? 'yes' : 'no');
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
      }

      // Tạo object mới để tránh lỗi khi destructuring
      const result = {
        id: user.id,
        username: user.username,
        role: user.role,
        isActive: true, // Giá trị mặc định nếu không có
        isFirstLogin: false // Giá trị mặc định nếu không có
      };
      
      console.log('Result object:', JSON.stringify(result));
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Lỗi trong validateUser:', error);
      throw new UnauthorizedException('Đăng nhập thất bại. Vui lòng thử lại sau.');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      console.log('Login attempt for username:', loginDto.username);
      
      const user = await this.validateUser(loginDto.username, loginDto.password);
      console.log('User validated successfully:', user ? 'yes' : 'no');
      
      if (!user || !user.id) {
        console.error('User object is invalid after validation');
        throw new UnauthorizedException('Đăng nhập thất bại: Thông tin người dùng không hợp lệ');
      }
      
      const payload = { 
        sub: user.id,
        username: user.username,
        role: user.role
      };
      
      console.log('Creating JWT payload:', JSON.stringify(payload));
      const token = this.jwtService.sign(payload);
      console.log('JWT token created successfully');
      
      const response = {
        accessToken: token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          isFirstLogin: false // Giá trị mặc định
        }
      };
      
      console.log('Login response created:', JSON.stringify({
        user_id: response.user.id,
        username: response.user.username,
        role: response.user.role
      }));
      
      return response;
    } catch (error) {
      console.error('Lỗi trong login:', error);
      throw error;
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const { oldPassword, newPassword, confirmPassword } = changePasswordDto;

      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Mật khẩu mới và xác nhận mật khẩu không khớp');
      }

      const user = await this.userRepository.findOne({ 
        where: { id: userId },
        select: ['id', 'password', 'isFirstLogin'] 
      });

      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');
      }

      // Hash mật khẩu mới
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Cập nhật mật khẩu và đánh dấu đã đổi mật khẩu lần đầu
      await this.userRepository.update(userId, {
        password: hashedPassword,
        isFirstLogin: false
      });

      return { message: 'Đổi mật khẩu thành công' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Lỗi trong changePassword:', error);
      throw new BadRequestException('Đổi mật khẩu thất bại. Vui lòng thử lại sau.');
    }
  }

  async createUser(createUserDto: CreateUserDto, adminId: string) {
    try {
      // Kiểm tra xem admin có quyền tạo người dùng không
      const admin = await this.userRepository.findOne({ 
        where: { id: adminId }
      });

      if (!admin || (admin.role !== UserRole.ADMIN && admin.role !== UserRole.SUPER_ADMIN)) {
        throw new UnauthorizedException('Bạn không có quyền tạo người dùng mới');
      }

      // Kiểm tra xem username hoặc email đã tồn tại chưa
      const existingUser = await this.userRepository.findOne({
        where: [
          { username: createUserDto.username },
          { email: createUserDto.email }
        ]
      });

      if (existingUser) {
        throw new ConflictException('Tên đăng nhập hoặc email đã tồn tại');
      }

      // Hash mật khẩu
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      // Tạo người dùng mới
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        isFirstLogin: true,
        isActive: true,
        role: createUserDto.role || UserRole.EMPLOYEE
      });

      await this.userRepository.save(newUser);

      // Tạo object mới để tránh lỗi khi destructuring
      const result = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        isActive: newUser.isActive || true,
        isFirstLogin: newUser.isFirstLogin || true,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };
      
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ConflictException) {
        throw error;
      }
      console.error('Lỗi trong createUser:', error);
      throw new BadRequestException('Tạo người dùng thất bại. Vui lòng thử lại sau.');
    }
  }
  
  async getProfile(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'fullName', 'email', 'username', 'role', 'isActive', 'isFirstLogin']
      });

      if (!user) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      // Tạo object mới để tránh lỗi khi destructuring
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive === undefined ? true : user.isActive,
        isFirstLogin: user.isFirstLogin === undefined ? false : user.isFirstLogin
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Lỗi trong getProfile:', error);
      throw new BadRequestException('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.');
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.find({
        select: ['id', 'fullName', 'email', 'username', 'role', 'isActive', 'isFirstLogin', 'createdAt', 'updatedAt']
      });
      
      // Map qua mảng để đảm bảo các trường không bị null/undefined
      return users.map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive === undefined ? true : user.isActive,
        isFirstLogin: user.isFirstLogin === undefined ? false : user.isFirstLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
    } catch (error) {
      console.error('Lỗi trong getAllUsers:', error);
      throw new BadRequestException('Không thể lấy danh sách người dùng. Vui lòng thử lại sau.');
    }
  }
}
