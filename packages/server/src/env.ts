import os from 'os';
import { resolve } from 'path';
import { load } from 'ts-dotenv';

/** set flag for llama cpp to use metal for apple silicone chips */
process.env.NODE_LLAMA_CPP_METAL = (
  os.arch() === 'arm64' && os.cpus().some(cpu => cpu.model.includes('Apple'))
).toString();

const NODE_ENV = process.env.NODE_ENV || 'local';

const envFile = load(
  {
    CLUSTER_MODE: Boolean,
    OPEN_API_KEY: String,
    PG_DATABASE: String,
    PG_HOST: String,
    PG_PASSWORD: String,
    PG_PORT: Number,
    PG_USERNAME: String,
    PORT: Number,
    REDIS_HOST: String,
    REDIS_PORT: Number
  },
  {
    overrideProcessEnv: false,
    path: resolve(__dirname, `./env/.env.${NODE_ENV}`)
  }
);

export type EnvVars = {
  NODE_ENV: string;
} & typeof envFile;

export const env = {
  ...envFile,
  NODE_ENV
} as unknown as EnvVars;
