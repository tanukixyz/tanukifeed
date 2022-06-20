import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import DatabaseProvider from '../lib/database';
import logger from '../lib/logger';
import Oracle from '../lib/oracle';
import { getRouter } from './router';

(async function () {
  // auto env
  dotenv.config();

  const database = new DatabaseProvider();
  await database.connect();

  const oracle = new Oracle(database);

  const port = process.env.PORT || '8080';

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', getRouter(oracle));

  app.use('/', express.static(path.join('.', 'public')));

  app.listen(port, () => {
    logger.onInfo({
      source: 'api',
      message: 'started rest api service',
      props: {
        address: `0.0.0.0:${port}`,
      },
    });
  });
})();
