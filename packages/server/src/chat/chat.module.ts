import { Module } from '@nestjs/common';

import { LlamaModule } from '../llama/llama.module';
import { OpenaiModule } from '../openai/openai.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [LlamaModule, OpenaiModule],
  providers: [ChatGateway]
})
export class ChatModule {}
