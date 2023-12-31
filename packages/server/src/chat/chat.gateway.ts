import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';

import { BufferMemory, BufferWindowMemory } from 'langchain/memory';
import { Logger } from 'nestjs-pino';
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';

import { WebSocketExceptionFilter } from '../filters';
import { LlamaService } from '../llama/llama.service';
import { OpenaiService } from '../openai/openai.service';

export type ClientContext = {
  llama: BufferMemory;
  openai: BufferMemory;
};

@WebSocketGateway({
  allowUpgrades: true,
  connectTimeout: 60 * 1000,
  cookie: true,
  exceptionFilters: [WebSocketExceptionFilter],
  pingInterval: 5000,
  serveClient: true,
  transports: ['websocket']
})
@Injectable()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private clients = new WeakMap<Socket, ClientContext>();

  @WebSocketServer()
  server: Server;

  constructor(
    private llama: LlamaService,
    private log: Logger,
    private openai: OpenaiService
  ) {}

  afterInit() {
    this.log.log({
      message: 'gateway initialized'
    });
  }

  handleConnection(client: Socket) {
    this.clients.set(client, {
      llama: new BufferWindowMemory({
        aiPrefix: 'AI:',
        humanPrefix: 'Human:',
        inputKey: 'question',
        k: 2,
        memoryKey: 'chat_history',
        outputKey: 'text'
      }),
      openai: new BufferWindowMemory({
        aiPrefix: 'AI:',
        humanPrefix: 'Human:',
        inputKey: 'question',
        k: 2,
        memoryKey: 'chat_history',
        outputKey: 'text'
      })
    });
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client);
  }

  @SubscribeMessage('ask::llama')
  async onAskLlama(
    @MessageBody() question: string,
    @ConnectedSocket() client: Socket
  ) {
    const start = performance.now();

    const text = await this.llama.ask(question, this.clients.get(client).llama);

    client.emit('answer::llama', text);
    client.emit('answer::llama', '<END>');

    this.log.debug(`llama took: ${(performance.now() - start) / 1000} seconds`);
  }

  @SubscribeMessage('ask::openapi')
  async onAskOpenApi(
    @MessageBody() question: string,
    @ConnectedSocket() client: Socket
  ) {
    const start = performance.now();

    await this.openai.ask(question, this.clients.get(client).openai, text => {
      client.emit('answer::openapi', text);

      if (text === '<END>') {
        this.log.debug(
          `openai took: ${(performance.now() - start) / 1000} seconds`
        );
      }
    });
  }
}
