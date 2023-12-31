import { Injectable } from '@nestjs/common';

import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import { PromptTemplate } from 'langchain/prompts';

import { env } from '../env';
import { PgVector } from '../pg/pg.service';

@Injectable()
export class OpenaiService {
  private openai = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    openAIApiKey: env.OPEN_API_KEY,
    streaming: true,
    temperature: 0.8
  });

  constructor(private pgVector: PgVector) {}

  async ask(
    question: string,
    memory: BufferMemory,
    onToken: (token: string) => void
  ) {
    await ConversationalRetrievalQAChain.fromLLM(
      this.openai,
      this.pgVector.pg.asRetriever(),
      {
        memory,
        qaChainOptions: {
          prompt: PromptTemplate.fromTemplate(`
            Assistant is a versatile language model capable of assisting with various tasks, from simple queries to detailed discussions on numerous topics. It generates human-like text, enabling natural conversations and coherent, relevant responses. Continuously learning, Assistant processes vast text data to deliver accurate, informative answers and engage in meaningful dialogue across diverse subjects. A valuable resource, it offers assistance and insights on an array of topics.

            Context: {context}
            Human: {question}  
            AI:
          `),
          type: 'stuff'
        },
        questionGeneratorChainOptions: {
          llm: this.openai
        },
        returnSourceDocuments: false
      }
    ).call(
      {
        question
      },
      [
        {
          handleLLMEnd() {
            onToken('<END>');
          },
          handleLLMNewToken(text): void {
            onToken(text);
          }
        }
      ]
    );
  }
}
