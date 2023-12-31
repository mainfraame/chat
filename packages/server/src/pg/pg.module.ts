import { Module } from '@nestjs/common';

import { PgVector } from './pg.service';

@Module({
  exports: [PgVector],
  providers: [PgVector]
})
export class PgModule {}
