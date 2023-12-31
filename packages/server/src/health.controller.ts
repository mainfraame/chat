import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult
} from '@nestjs/terminus';

import { redis } from './adapters/redis.adapter';

@Controller()
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get('/api/v1/health')
  @HealthCheck()
  getHealth() {
    return this.health.check([
      () =>
        HealthController.checkService('redis', () =>
          redis.isReady ? Promise.resolve(true) : Promise.reject(false)
        )
    ]);
  }

  private static async checkService(
    name: string,
    service: () => Promise<unknown>
  ): Promise<HealthIndicatorResult> {
    try {
      await service();

      return {
        [name]: {
          status: 'up'
        }
      };
    } catch (e) {
      return Promise.reject({
        [name]: {
          details: e,
          status: 'down'
        }
      });
    }
  }
}
