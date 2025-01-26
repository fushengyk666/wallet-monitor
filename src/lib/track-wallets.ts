import { RpcConnectionManager } from '../providers/solana'
import { SetupWalletWatcherProps } from '../types/general-interfaces'
import { WalletWithUsers } from '../types/swap-types'
import { WatchTransaction } from './watch-transactions'

export const walletsArray: WalletWithUsers[] = []

export class TrackWallets {
  private walletWatcher: WatchTransaction

  public walletsState: []

  constructor() {
    this.walletWatcher = new WatchTransaction()

    this.walletsState = []
  }

  public async setupWalletWatcher({ event }: SetupWalletWatcherProps): Promise<void> {
    let walletsToFetch
    if (event === 'initial') {
      const allWallets = [{'address':'2P7Zqm6iDUYZPffVoPugHVFwg3ziSWeMLBP5tVt6u56D','name':'JW'}]
      return await this.walletWatcher.watchSocket(allWallets!)
    }
  }

  public async stopWatching(): Promise<void> {
    for (const [wallet, subscriptionId] of this.walletWatcher.subscriptions) {
      RpcConnectionManager.logConnection.removeOnLogsListener(subscriptionId)
      console.log(`Stopped watching transactions for wallet: ${wallet}`)
    }
    this.walletWatcher.subscriptions.clear()
  }

  public async updateWallets(newWallets: WalletWithUsers[]): Promise<void> {
    // await this.stopWatching();
    console.log('REFETCHING WALLETS')
    await this.walletWatcher.watchSocket(newWallets)
  }
}
