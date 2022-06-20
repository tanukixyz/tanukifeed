import { Router } from 'express';

import { getTimestamp } from '../lib/helper';
import Oracle from '../lib/oracle';

export function getRouter(oracle: Oracle): Router {
  const router = Router({ mergeParams: true });

  router.get('/tokenstats', async (request, response) => {
    const coingeckoId = request.query.coingeckoId || null;
    const timestamp = Number(request.query.timestamp) || getTimestamp();

    if (!coingeckoId) {
      response.status(403).json({ error: 'invalid coingecko id', data: null });
    } else {
      const coinStats = await oracle.getCoinStats({
        coingeckoId: String(coingeckoId),
        timestamp: timestamp,
      });
      response.status(200).json({ error: null, data: coinStats });
    }
  });

  return router;
}
