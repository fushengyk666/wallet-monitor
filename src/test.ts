import { SwapType } from './types/swap-types'
import { TxMessages } from './messages/tx-message'


const message = {
  platform: 'raydium' as SwapType,
  owner: 'suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK',
  description: 'suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK swapped 4.95 SOL for 4,619,674.19 JAKEY',
  type: 'buy',
  balanceChange: -5.130005,
  signature: '2sALSsFCKPa3rduqM6A4kUzdKxKSGn4h75MyeGbFpCaLLpb7WcFhZkvyaZViAZMAMGLya41Sr6k5w2wdFBpYgdmT',
  swappedTokenMc: 299105.876590664,
  swappedTokenPrice: 0.00029910587659066396,
  solPrice: '260.6',
  tokenTransfers: {
    tokenInSymbol: 'JAKEY',
    tokenInMint: '8SCJeYKM4FN7L5pezoACAnk9VRtzzLAoTzmGa36Epump',
    tokenAmountIn: '4,619,674.19',
    tokenOutSymbol: 'SOL',
    tokenOutMint: 'So11111111111111111111111111111111111111112',
    tokenAmountOut: '4.95'
  }
}
const formattedMarketCap = '299.11K'
const walletName = 'test'
const messageText = TxMessages.txMadeMessage(message, formattedMarketCap, walletName)
console.log(messageText)