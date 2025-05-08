import {
  Logger,
  NotFoundException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export function handleError(
  e: unknown,
  message: string,
  logger: Logger,
): never {
  logger.error(
    `${message}: ${e instanceof Error ? e.message : JSON.stringify(e)}`,
  );

  let code: string | number = 'UNEXPECTED_ERROR';
  let details: Record<string, unknown> | null = null;
  let status = HttpStatus.INTERNAL_SERVER_ERROR;

  if (e instanceof NotFoundException) {
    code = 'NOT_FOUND';
    status = HttpStatus.NOT_FOUND;
  } else if (e instanceof UnauthorizedException) {
    code = 'UNAUTHORIZED';
    status = HttpStatus.UNAUTHORIZED;
  } else if (e instanceof PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002':
        code = 'UNIQUE_CONSTRAINT_FAILED';
        details = e.meta;
        message = `Нарушено ограничение уникальности: ${JSON.stringify(e.meta?.target)}`;
        status = HttpStatus.BAD_REQUEST;
        break;
      case 'P2016':
        code = 'NOT_FOUND';
        status = HttpStatus.NOT_FOUND;
        break;
      case 'P2003':
        code = 'FOREIGN_KEY_CONSTRAINT_FAILED';
        details = e.meta;
        message = `Нарушение внешнего ключа: ${JSON.stringify(e.meta?.field_name)}`;
        status = HttpStatus.BAD_REQUEST;
        break;
      default:
        code = 'PRISMA_CLIENT_KNOWN_ERROR';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }
  } else if (
    e instanceof PrismaClientUnknownRequestError ||
    e instanceof PrismaClientRustPanicError ||
    e instanceof PrismaClientInitializationError ||
    e instanceof PrismaClientValidationError
  ) {
    code = 'PRISMA_CLIENT_ERROR';
    message = e.message;
    status = HttpStatus.INTERNAL_SERVER_ERROR;
  }

  throw new HttpException(
    {
      success: false,
      data: null,
      error: {
        message,
        code,
        details,
      },
    },
    status,
  );
}
