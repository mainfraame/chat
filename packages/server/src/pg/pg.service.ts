import { Injectable, OnModuleInit } from '@nestjs/common';

import { HuggingFaceTransformersEmbeddings } from 'langchain/embeddings/hf_transformers';
import { PGVectorStore } from 'langchain/vectorstores/pgvector';

import { env } from '../env';

@Injectable()
export class PgVector implements OnModuleInit {
  pg: PGVectorStore;

  async onModuleInit() {
    this.pg = await PGVectorStore.initialize(
      new HuggingFaceTransformersEmbeddings(),
      {
        columns: {
          contentColumnName: 'content',
          idColumnName: 'id',
          metadataColumnName: 'metadata',
          vectorColumnName: 'vector'
        },
        postgresConnectionOptions: {
          database: env.PG_DATABASE,
          host: env.PG_HOST,
          password: env.PG_PASSWORD,
          port: env.PG_PORT,
          user: env.PG_USERNAME
        },
        tableName: 'documents'
      }
    );
  }
}
