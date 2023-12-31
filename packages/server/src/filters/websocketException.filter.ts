import { ExceptionFilter } from '@nestjs/common';

import { Logger } from 'nestjs-pino';

export class WebSocketExceptionFilter implements ExceptionFilter {
  constructor(private log: Logger) {}

  catch(exception: any, host: any) {
    this.log.error({
      host,
      message: exception.message,
      stack: exception.stack
    });
  }
}
