import { Module } from '@nestjs/common';

import { PgModule } from '../pg/pg.module';
import { OpenaiService } from './openai.service';

@Module({
  exports: [OpenaiService],
  imports: [PgModule],
  providers: [OpenaiService]
})
export class OpenaiModule {}
