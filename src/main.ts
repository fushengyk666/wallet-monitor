import dotenv from 'dotenv'
import { bot } from './providers/telegram'
import express, { Express } from 'express'
import { TrackWallets } from './lib/track-wallets'
import { CronJobs } from './lib/cron-jobs'

dotenv.config()

const PORT = process.env.PORT || 3002

class Main {
  private trackWallets: TrackWallets
  private cronJobs: CronJobs
  
  constructor(private app: Express = express()) {
    this.app.use(express.json({ limit: '50mb' }))

    this.setupRoutes()
    this.trackWallets = new TrackWallets()
    this.cronJobs = new CronJobs()
    this.app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  }

  setupRoutes() {
    // Default endpoint
    this.app.get('/', async (req, res) => {
      try {
        res.status(200).send('Hello world')
      } catch (error) {
        console.error('Default route error', error)
        res.status(500).send('Error processing default rpute')
      }
    })
    this.app.post(`/webhook/telegram`, async (req, res) => {
      try {
        bot.processUpdate(req.body)

        res.status(200).send('Update received')
      } catch (error) {
        console.log('Error processing update:', error)
        res.status(500).send('Error processing update')
      }
    })
  }

  public async init(): Promise<void> {
    await this.trackWallets.setupWalletWatcher({ event: 'initial' })
    await this.cronJobs.updateSolPrice()
  }
}

const main = new Main()
main.init()
