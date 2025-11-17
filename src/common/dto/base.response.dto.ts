export class BaseResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: number;
  statusCode: number;

  constructor(data?: T, message = 'Success', statusCode = 200) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
    this.statusCode = statusCode;
  }

  static success<T>(data?: T, message = 'Success', statusCode = 200): BaseResponseDto<T> {
    return new BaseResponseDto<T>(data, message, statusCode);
  }

  static error<T>(message = 'Error', statusCode = 500, data?: T): BaseResponseDto<T> {
    return new BaseResponseDto<T>(data, message, statusCode);
  }
}
