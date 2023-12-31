import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';

import { env } from '../env';

export const redis = createClient({
  url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`
});

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const subClient = redis.duplicate();

    await Promise.all([redis.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(redis, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
