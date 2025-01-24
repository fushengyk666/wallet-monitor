import { Connection, clusterApiUrl } from '@solana/web3.js'
import dotenv from 'dotenv'

dotenv.config()

const SOLANA_NETWORK = clusterApiUrl('mainnet-beta')
const HELIUS_NETWORK = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
const CHAINSTACK_NETWORK = `https://solana-mainnet.core.chainstack.com/${process.env.CHAINSTACK_API_KEY}`
const QUICKNODE_NETWORK = process.env.QUICKNODE_API_KEY ?? ''

export class RpcConnectionManager {
    static connections = [new Connection(QUICKNODE_NETWORK, 'processed')]
  
    static logConnection = new Connection(HELIUS_NETWORK, {
      commitment: 'processed',
    })
  
    static getRandomConnection(): Connection {
      const randomIndex = Math.floor(Math.random() * RpcConnectionManager.connections.length)
      return RpcConnectionManager.connections[randomIndex]
    }
  }
