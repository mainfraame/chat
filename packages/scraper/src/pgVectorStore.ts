import { HuggingFaceTransformersEmbeddings } from 'langchain/embeddings/hf_transformers';
import { PGVectorStore } from 'langchain/vectorstores/pgvector';

export const initialize = () =>
  PGVectorStore.initialize(new HuggingFaceTransformersEmbeddings(), {
    columns: {
      contentColumnName: 'content',
      idColumnName: 'id',
      metadataColumnName: 'metadata',
      vectorColumnName: 'vector'
    },
    postgresConnectionOptions: {
      database: 'langchain',
      host: '127.0.0.1',
      password: 'ChangeMe',
      port: 5433,
      user: 'postgres'
    },
    tableName: 'documents'
  });
