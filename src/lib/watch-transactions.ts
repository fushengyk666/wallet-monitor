import { Connection, PublicKey, LogsFilter, Logs } from '@solana/web3.js'
import EventEmitter from 'events'
import { TransactionParser } from '../parsers/transaction-parser'
import { SwapType, WalletWithUsers } from '../types/swap-types'
import { SendTransactionMsgHandler } from '../handlers/send-tx-msg-handler'
import { bot } from '../providers/telegram'
import { RpcConnectionManager } from '../providers/solana'
import {
  JUPITER_PROGRAM_ID,
  PUMP_FUN_PROGRAM_ID,
  PUMP_FUN_TOKEN_MINT_AUTH,
  RAYDIUM_PROGRAM_ID,
} from '../config/program-ids'
import { CronJobs } from './cron-jobs'


export const trackedWallets: Set<string> = new Set()

export class WatchTransaction extends EventEmitter {
  public subscriptions: Map<string, number>

  private walletTransactions: Map<string, { count: number; startTime: number }>
  private excludedWallets: Map<string, boolean>

  constructor() {
    super()

    this.subscriptions = new Map()
    this.walletTransactions = new Map()
    this.excludedWallets = new Map()

  }

  public async watchSocket(wallets: WalletWithUsers[]): Promise<void> {
    try {
      console.log('WATCHING SOCKET', wallets)
      for (const wallet of wallets) {
        const publicKey = new PublicKey(wallet.address)
        const walletAddress = publicKey.toBase58()

        // Check if a subscription already exists for this wallet address
        if (this.subscriptions.has(walletAddress)) {
          // console.log(`Already watching for: ${walletAddress}`)
          continue // Skip re-subscribing
        }

        console.log(`Watching transactions for wallet: ${walletAddress}`)

        // Initialize transaction count and timestamp
        this.walletTransactions.set(walletAddress, { count: 0, startTime: Date.now() })

        // Start real-time log
        const subscriptionId = RpcConnectionManager.logConnection.onLogs(
          publicKey,
          async (logs, ctx) => {
            console.log('LOGS', {
              signature: logs.signature,
              receivedTime: new Date().toISOString()
            })

            if (this.excludedWallets.has(walletAddress)) {
              console.log(`Wallet ${walletAddress} is excluded from logging.`)
              return
            }

            const { isRelevant, swap } = this.isRelevantTransaction(logs)

            // new approach!! lets see if we can keep this
            if (!isRelevant) {
              console.log('TRANSACTION IS NOT DEFI')
              return
            }

            // check txs per second
            const walletData = this.walletTransactions.get(walletAddress)
            if (!walletData) {
              return
            }

            const transactionSignature = logs.signature
            const transactionDetails = await this.getParsedTransaction(transactionSignature)
            console.log('TRANSACTION DETAILS', transactionDetails)
            if (!transactionDetails) {
              return
            }

            // Parse transaction
            const solPriceUsd = CronJobs.getSolPrice()
            const transactionParser = new TransactionParser(transactionSignature)
            const parsed = await transactionParser.parseRpc(transactionDetails, swap, solPriceUsd)

            if (!parsed) {
              return
            }

            // console.log(parsed)

            // Use bot to send message of transaction
            //todo 发送消息
            const sendMessageHandler = new SendTransactionMsgHandler(bot)
            await sendMessageHandler.send(parsed,'-1002422058600', wallet.name)
          },
          'processed',
        )
        console.log(`Subscribed to logs with subscription ID: ${subscriptionId}`)
        
        // 每次订阅后休眠50ms
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error in watchSocket:', error)
    }
  }

  private async getParsedTransaction(transactionSignature: string) {
    try {
      const transactionDetails = await RpcConnectionManager.heliusConnection.getParsedTransactions([transactionSignature], {
        maxSupportedTransactionVersion: 0,
      })

      return transactionDetails
    } catch (error) {
      console.log('GET_PARSED_TRANSACTIONS_ERROR', error)
      return
    }
  }

  private isRelevantTransaction(logs: Logs): { isRelevant: boolean; swap: SwapType } {
    if (!logs.logs || logs.logs.length === 0) {
      return { isRelevant: false, swap: null }
    }

    // Join logs into a single string for searching
    const logString = logs.logs.join(' ')

    if (logString.includes(PUMP_FUN_TOKEN_MINT_AUTH)) {
      return { isRelevant: true, swap: 'mint_pumpfun' }
    }
    if (logString.includes(PUMP_FUN_PROGRAM_ID)) {
      console.log('PUMP_FUN_PROGRAM_ID', logString)
      return { isRelevant: true, swap: 'pumpfun' }
    }
    if (logString.includes(RAYDIUM_PROGRAM_ID)) {
      return { isRelevant: true, swap: 'raydium' }
    }
    if (logString.includes(JUPITER_PROGRAM_ID)) {
      return { isRelevant: true, swap: 'jupiter' }
    }

    return { isRelevant: false, swap: null }
  }
}
