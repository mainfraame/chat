import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common';

import { FastifyReply, FastifyRequest } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();
    const req = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();
    const response = exception.getResponse() as Record<string, unknown>;

    req.log[status >= 400 && status < 500 ? 'warn' : 'error']({
      ...response,
      name: exception.name,
      status
    });

    return res.status(status).send({
      error: exception.name?.replace('Exception', ''),
      ...response,
      statusCode: status
    });
  }
}
