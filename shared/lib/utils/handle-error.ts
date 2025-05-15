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
  const eMessage = e instanceof Error ? e.message : JSON.stringify(e);
  logger.error(`${message}: ${eMessage}`);

  let code: string | number = 'UNEXPECTED_ERROR';
  let details: Record<string, unknown> | null = null;
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = eMessage;

  if (e instanceof NotFoundException) {
    code = 'NOT_FOUND';
    status = HttpStatus.NOT_FOUND;
    errorMessage = 'Ресурс не найден';
  } else if (e instanceof UnauthorizedException) {
    code = 'UNAUTHORIZED';
    status = HttpStatus.UNAUTHORIZED;
    errorMessage = 'Доступ запрещён';
  } else if (e instanceof PrismaClientKnownRequestError) {
    details = e.meta ?? null;

    switch (e.code) {
      case 'P2002':
        code = 'UNIQUE_CONSTRAINT_FAILED';
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Нарушено ограничение уникальности: ${JSON.stringify(e.meta?.target)}`;
        break;

      case 'P2003':
        code = 'FOREIGN_KEY_CONSTRAINT_FAILED';
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Нарушение внешнего ключа: ${JSON.stringify(e.meta?.field_name)}`;
        break;

      case 'P2016':
        code = 'NOT_FOUND';
        status = HttpStatus.NOT_FOUND;
        errorMessage = 'Связанный объект не найден';
        break;

      default:
        code = 'PRISMA_CLIENT_KNOWN_ERROR';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = 'Произошла ошибка при работе с базой данных';
        break;
    }

    logger.error(`Prisma error details: ${JSON.stringify(details)}`);
  } else if (
    e instanceof PrismaClientUnknownRequestError ||
    e instanceof PrismaClientRustPanicError ||
    e instanceof PrismaClientInitializationError ||
    e instanceof PrismaClientValidationError
  ) {
    code = 'PRISMA_CLIENT_ERROR';
    status = HttpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = e.message || 'Неизвестная ошибка Prisma';
  }

  throw new HttpException(
    {
      success: false,
      data: null,
      error: {
        message: errorMessage,
        code,
        details,
      },
    },
    status,
  );
}
