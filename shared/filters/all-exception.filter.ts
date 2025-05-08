import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  // Logger,
} from '@nestjs/common';
import {
  //  Request,
  Response,
} from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            success: false,
            data: null,
            error: {
              message:
                typeof exception === 'object' &&
                exception !== null &&
                'message' in exception
                  ? (exception as { message: string }).message
                  : 'Internal server error',
              code: 'UNEXPECTED_ERROR',
              details: null,
            },
          };

    // this.logger.error(
    //   `${request.method} ${request.url} - Status: ${status}`,
    //   typeof exception === 'object' &&
    //     exception !== null &&
    //     'stack' in exception
    //     ? (exception as { stack: string }).stack
    //     : undefined,
    //   exception instanceof HttpException ? exception.message : undefined,
    // );

    response.status(status).json(responseBody);
  }
}
