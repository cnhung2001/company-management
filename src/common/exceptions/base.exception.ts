import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    data?: any,
  ) {
    super(
      {
        success: false,
        message,
        data,
        timestamp: Date.now(),
        statusCode,
      },
      statusCode,
    );
  }
}

export class BadRequestException extends BaseException {
  constructor(message = 'Bad Request', data?: any) {
    super(message, HttpStatus.BAD_REQUEST, data);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message = 'Unauthorized', data?: any) {
    super(message, HttpStatus.UNAUTHORIZED, data);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message = 'Forbidden', data?: any) {
    super(message, HttpStatus.FORBIDDEN, data);
  }
}

export class NotFoundException extends BaseException {
  constructor(message = 'Not Found', data?: any) {
    super(message, HttpStatus.NOT_FOUND, data);
  }
}

export class ConflictException extends BaseException {
  constructor(message = 'Conflict', data?: any) {
    super(message, HttpStatus.CONFLICT, data);
  }
}

export class InternalServerErrorException extends BaseException {
  constructor(message = 'Internal Server Error', data?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, data);
  }
}
