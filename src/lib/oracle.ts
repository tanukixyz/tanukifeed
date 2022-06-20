import axios from 'axios';

import DatabaseProvider from './database';
import envConfig from './env';
import { sleep } from './helper';
import logger from './logger';
import { CoinStats, GetCoinStatsProps } from './types';

class Oracle {
  private readonly database: DatabaseProvider;

  constructor(databaseProvider: DatabaseProvider) {
    this.database = databaseProvider;
  }

  public async getCoinStats(props: GetCoinStatsProps): Promise<CoinStats> {
    const { coingeckoId, timestamp } = props;
    const theDate = new Date(timestamp * 1000);

    const collection = await this.database.getCollection(envConfig.database.collections.priceFeeds);

    // get the day timestamp
    const dayTimestamp = Math.floor(new Date(theDate.toISOString().split('T')[0]).getTime() / 1000);
    const savedData = await collection
      .find({
        coingeckoId: coingeckoId,
        timestamp: dayTimestamp,
      })
      .limit(1)
      .toArray();
    if (savedData.length > 0) {
      return {
        priceUSD: savedData[0].priceUSD,
        marketCapUSD: savedData[0].marketCapUSD,
        timestamp: savedData[0].timestamp,
      };
    }

    // query new data from coingecko
    const dmy = theDate.toISOString().split('T')[0].split('-');
    const day = Number(dmy[2]) > 9 ? Number(dmy[2]) : `0${Number(dmy[2])}`;
    const month = Number(dmy[1]) > 9 ? Number(dmy[1]) : `0${Number(dmy[1])}`;

    const coinStats: CoinStats = {
      priceUSD: 0,
      marketCapUSD: 0,
      timestamp: dayTimestamp,
    };

    try {
      await sleep(1); // avoid coingecko limit
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coingeckoId}/history?date=${day}-${month}-${dmy[0]}`
      );
      if (response.data) {
        coinStats.priceUSD = Number(response.data['market_data']['current_price']['usd']);
        coinStats.marketCapUSD = Number(response.data['market_data']['market_cap']['usd']);
      }
    } catch (e: any) {
      logger.onError({
        source: 'oracle',
        message: 'failed to query coingecko api',
        props: {
          coingeckoId: coingeckoId,
          timestamp: timestamp,
        },
        error: e,
      });
    }

    // save data to database
    await collection.updateOne(
      {
        coingeckoId: coingeckoId,
        timestamp: dayTimestamp,
      },
      {
        $set: {
          coingeckoId: coingeckoId,
          ...coinStats,
        },
      },
      {
        upsert: true,
      }
    );

    return coinStats;
  }
}

export default Oracle;
