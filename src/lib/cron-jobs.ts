import { TokenUtils } from './token-utils'
import cron from 'node-cron'

export class CronJobs {

  private static cachedPrice: string | undefined = undefined
  private static lastFetched: number = 0
  private static readonly refreshInterval: number = 5 * 60 * 1000 // 5 minutes
  constructor() {
  }

  public async updateSolPrice(): Promise<void> {
    cron.schedule('*/10 * * * *', async () => {
      const now = Date.now()
      if (CronJobs.cachedPrice && now - CronJobs.lastFetched < CronJobs.refreshInterval) {
        return 
      }

      try {
        console.log('REFETCHING SOL PRICE')
        let solPrice = await TokenUtils.getSolPriceGecko()
        if (!solPrice) {
          solPrice = await TokenUtils.getSolPriceNative()
        }

        if (solPrice) {
          CronJobs.cachedPrice = solPrice
          CronJobs.lastFetched = now
        }

      } catch (error) {
        console.error('Error fetching Solana price:', error)
        return
      }
    })
  }

  static getSolPrice() {
    return this.cachedPrice
  }
}