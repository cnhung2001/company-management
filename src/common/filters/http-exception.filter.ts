import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    
    // Check if the exception is our BaseException format
    if (exceptionResponse && typeof exceptionResponse === 'object' && 'success' in exceptionResponse) {
      // Already formatted by BaseException
      return response.status(status).json(exceptionResponse);
    }
    
    // Format other HttpExceptions
    const errorResponse = {
      success: false,
      statusCode: status,
      message: typeof exceptionResponse === 'object' && exceptionResponse.message 
        ? exceptionResponse.message 
        : exception.message,
      timestamp: Date.now(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const errorResponse = {
      success: false,
      statusCode: status,
      message: exception.message || 'Internal server error',
      timestamp: Date.now(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
