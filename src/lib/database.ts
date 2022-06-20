import { Collection, MongoClient } from 'mongodb';

import envConfig from './env';
import { sleep } from './helper';
import logger from './logger';

class DatabaseProvider {
  public readonly name: string = 'database';
  private _connected: boolean = false;
  private _client: MongoClient | null = null;
  private _db: any = null;

  constructor() {}

  public async connect(): Promise<void> {
    if (!this._connected) {
      this._client = new MongoClient(envConfig.database.connectionUri as string);

      while (!this._connected) {
        try {
          await this._client?.connect();
          this._db = this._client?.db(envConfig.database.name as string);
          this._connected = true;
          logger.onInfo({
            source: this.name,
            message: 'database connected',
            props: {
              name: envConfig.database.name as string,
            },
          });

          // setup basic indies
          this.setupIndies();
        } catch (e: any) {
          logger.onWarn({
            source: this.name,
            message: 'database connect failed',
            props: {
              name: envConfig.database.name as string,
              error: e.message,
            },
          });
          await sleep(5);
        }
      }

      if (!this._connected) {
        this.onError(Error('failed to connect to database'));
      }
    }
  }

  public async getCollection(name: string): Promise<Collection> {
    let collection: Collection | null = null;
    if (this._connected) {
      collection = this._db ? this._db.collection(name) : null;
    } else {
      this.onError(Error('failed to get collection'));
    }

    if (!collection) {
      this.onError(Error('failed to get collection'));
      process.exit(1);
    }

    return collection;
  }

  public onError(error: Error): void {
    logger.onError({
      source: this.name,
      message: 'database connect failed, exit process now',
      props: {
        name: envConfig.database.name as string,
      },
    });
    process.exit(1);
  }

  public async setupIndies(): Promise<void> {
    const priceFeedCollection = await this.getCollection(envConfig.database.collections.priceFeeds);
    priceFeedCollection.createIndex({ coingeckoId: 1 }, { background: true });
    priceFeedCollection.createIndex({ coingeckoId: 1, timestamp: 1 }, { background: true });
  }
}

export default DatabaseProvider;
