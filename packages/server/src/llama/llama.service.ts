import { Injectable, OnModuleInit } from '@nestjs/common';

import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { ChatLlamaCpp } from 'langchain/chat_models/llama_cpp';
import { BufferMemory } from 'langchain/memory';
import { PromptTemplate } from 'langchain/prompts';
import { RunnableSequence } from 'langchain/schema/runnable';
import path from 'path';

import { PgVector } from '../pg/pg.service';

@Injectable()
export class LlamaService implements OnModuleInit {
  context: RunnableSequence;
  llama: ChatLlamaCpp;

  constructor(private pgVector: PgVector) {}

  async onModuleInit() {
    this.llama = new ChatLlamaCpp({
      batchSize: 1024,
      contextSize: 4096,
      f16Kv: true,
      modelPath: path.resolve(__dirname, '../gguf-llama2-chat-q4_0.bin'),
      temperature: 0.8,
      topP: 1,
      verbose: true
    });
  }

  async ask(question: string, memory: BufferMemory) {
    const response = await ConversationalRetrievalQAChain.fromLLM(
      this.llama,
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
          type: 'stuff',
          verbose: true
        },
        questionGeneratorChainOptions: {
          llm: this.llama
        },
        returnSourceDocuments: false,
        verbose: true
      }
    ).call({
      question
    });

    return response.text;
  }
}
