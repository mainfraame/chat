import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { LoggerModule } from 'nestjs-pino';

import { ChatModule } from './chat/chat.module';
import { HealthController } from './health.controller';
import { PgVector } from './pg/pg.service';

@Module({
  controllers: [HealthController],
  imports: [
    ChatModule,
    LoggerModule.forRoot({
      exclude: ['/api/v1/health'],
      pinoHttp: {
        autoLogging: true
      },
      useExisting: true
    }),
    TerminusModule
  ],
  providers: [PgVector]
})
export class AppModule {}
