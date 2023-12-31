import cluster from 'cluster';
import os from 'os';

import { env } from './env';
import { logger } from './logger';

export class AppCluster {
  static register(callback: () => Promise<void>): void {
    if (cluster.isMaster && env.CLUSTER_MODE) {
      logger.info(`master started on ${process.pid}`);

      cluster.on('online', worker => {
        logger.info(`worker ${worker.process.pid} is online`);
      });

      cluster.on('exit', (worker, code, signal) => {
        logger.error({
          code,
          pid: worker.process.pid,
          signal,
          type: 'cluster worker died'
        });

        cluster.fork();
      });

      cluster.on('listening', (worker, address) => {
        logger.info({
          address,
          pid: worker.process.pid,
          type: 'cluster created worker'
        });
      });

      process.on('uncaughtException', error => {
        logger.error({
          error: error.toString(),
          pid: process.pid,
          type: 'cluster has uncaught exception'
        });

        process.exit(1);
      });

      os.cpus().forEach(() => cluster.fork());
    } else {
      logger.info(`master started on ${process.pid}`);

      process.on('uncaughtException', error => {
        logger.error({
          error: error.toString(),
          pid: process.pid,
          type: 'cluster has uncaught exception'
        });

        process.exit(1);
      });

      callback();
    }
  }
}
