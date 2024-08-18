import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ForbiddenException,
  UnauthorizedException,
  BadGatewayException,
  HttpException
} from '@nestjs/common';
import { Response } from 'express';
import { Response as ApiResponse } from '@utils/utils.service';
import { ApiResponseT } from '@utils/types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message || "Internal Server Error";

    const response_structure: ApiResponseT = new ApiResponse({
      data: null,
      message,
      error: [
        message
      ],
    }).freeze();

    return response.status(status).json(response_structure);
  }
}


@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception.getStatus() || HttpStatus.FORBIDDEN;
    const errors = exception['response']['message'];
    const data = null;
    const message = 'You do not have permission to access';
    const response_structure: ApiResponseT = new ApiResponse({
      data,
      message,
      error: [
        errors
      ],
    }).freeze();

    return response.status(status).json(response_structure);
  }
}

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception.getStatus() || HttpStatus.UNAUTHORIZED;
    const errors = exception['response']['message'];
    const data = null;
    const message = 'You are not authorized to access';
    const response_structure: ApiResponseT = new ApiResponse({
      data,
      message,
      error: [
        errors
      ],
    }).freeze();

    return response.status(status).json(response_structure);
  }
}


@Catch(BadGatewayException)
export class BadGatewayExceptionFilter implements ExceptionFilter {
  catch(exception: BadGatewayException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status: number = exception.getStatus() || HttpStatus.BAD_GATEWAY;
    const errors = exception['response']['message'];
    const data = null;
    const message = 'Service is down or unreachable';
    const response_structure: ApiResponseT = new ApiResponse({
      data,
      message,
      error: [
        errors
      ],
    }).freeze();

    return response.status(status).json(response_structure);
  }
}