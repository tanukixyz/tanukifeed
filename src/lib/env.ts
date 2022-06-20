import dotenv from 'dotenv';

import { EnvConfig } from './types';

// global env and configurations
dotenv.config();

const envConfig: EnvConfig = {
  database: {
    name: String(process.env.TANUKI_DATABASE_NAME),
    connectionUri: String(process.env.TANUKI_DATABASE_URL),
    collections: {
      priceFeeds: 'tanukixyz.pricefeeds',
    },
  },
  env: {
    timezone: String(process.env.TANUKI_TZ),
  },
};

export default envConfig;
