import { Module } from '@nestjs/common';

import { PgModule } from '../pg/pg.module';
import { LlamaService } from './llama.service';

@Module({
  exports: [LlamaService],
  imports: [PgModule],
  providers: [LlamaService]
})
export class LlamaModule {}
