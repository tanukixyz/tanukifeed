export interface EnvConfig {
  database: {
    name: string;
    connectionUri: string;
    collections: {
      priceFeeds: string;
    };
  };
  env: {
    timezone: string;
  };
}

export interface CoinStats {
  priceUSD: number;
  marketCapUSD: number;
  timestamp: number;
}

export interface GetCoinStatsProps {
  coingeckoId: string;
  timestamp: number;
}
