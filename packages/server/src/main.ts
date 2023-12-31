import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';

import { nanoid } from 'nanoid';
import { Logger } from 'nestjs-pino';

import { RedisIoAdapter } from './adapters';
import { AppCluster } from './app.cluster';
import { AppModule } from './app.module';
import { env } from './env';
import { HttpExceptionFilter, WebSocketExceptionFilter } from './filters';
import { logger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: req => req.headers['x-trace-id'] || nanoid(),
      keepAliveTimeout: 196 * 1000,
      logger,
      trustProxy: true
    }),
    {
      bufferLogs: true
    }
  );

  const redisIoAdapter = new RedisIoAdapter(app);

  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  const Log = app.get(Logger);

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new WebSocketExceptionFilter(Log)
  );

  app.getHttpServer().headersTimeout = 197 * 1000;

  app.useLogger(Log);

  app.flushLogs();

  app.enableShutdownHooks();

  return app;
}

AppCluster.register(async () => {
  await (await bootstrap()).listen(env.PORT, '0.0.0.0');
});
