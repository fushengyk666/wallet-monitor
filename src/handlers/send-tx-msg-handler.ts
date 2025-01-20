import TelegramBot from 'node-telegram-bot-api'
import { TokenPrices } from '../lib/token-prices-api'
import { FormatNumbers } from '../lib/format-numbers'
import { createTxSubMenu } from '../config/bot-menus'
import { TxMessages } from '../messages/tx-message'
import { NativeParserInterface } from '../types/general-interfaces'

export class SendTransactionMsgHandler {
  private tokenPrices: TokenPrices
  constructor(private bot: TelegramBot) {
    this.bot = bot

    this.tokenPrices = new TokenPrices()
  }

  public async send(message: NativeParserInterface, chatId: string,walletName?: string) {
    const tokenToMc = message.type === 'buy' ? message.tokenTransfers.tokenInMint : message.tokenTransfers.tokenOutMint
    const tokenToMcSymbol =
      message.type === 'buy' ? message.tokenTransfers.tokenInSymbol : message.tokenTransfers.tokenOutSymbol

    const TX_SUB_MENU = createTxSubMenu(tokenToMcSymbol, tokenToMc)

    try {
      if (message.platform === 'raydium' || message.platform === 'jupiter') {
        let tokenMarketCap = message.swappedTokenMc

        // Check if the market cap is below 1000 and adjust if necessary
        if (tokenMarketCap && tokenMarketCap < 1000) {
          console.log('MC ADJUSTED')
          tokenMarketCap *= 1000
        }

        const formattedMarketCap = tokenMarketCap ? FormatNumbers.formatPrice(tokenMarketCap) : undefined
        const tokenPrice = message.swappedTokenPrice

        const messageText = TxMessages.txMadeMessage(message, formattedMarketCap, walletName)
        return this.bot.sendMessage(chatId, messageText, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: TX_SUB_MENU,
        })
      } else if (message.platform === 'pumpfun') {
        // const tokenInfo = await this.tokenPrices.gmgnTokenInfo(tokenToMc)
        // let tokenMarketCap = tokenInfo?.market_cap
        // const tokenInfo = await this.tokenPrices.pumpFunTokenInfo(tokenToMc)
        // let tokenMarketCap = tokenInfo?.usd_market_cap

        let tokenMarketCap = message.swappedTokenMc

        const formattedMarketCap = tokenMarketCap ? FormatNumbers.formatPrice(tokenMarketCap) : undefined

        const messageText = TxMessages.txMadeMessage(message, formattedMarketCap, walletName)
        return this.bot.sendMessage(chatId, messageText, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: TX_SUB_MENU,
        })
      } else if (message.platform === 'mint_pumpfun') {
        // new!
        const messageText = TxMessages.tokenMintedMessage(message, walletName)

        return this.bot.sendMessage(chatId, messageText, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_markup: TX_SUB_MENU,
        })
      }
    } catch (error: any) {
      if (error.response && error.response.statusCode === 403) {
        console.log(`User ${chatId} has blocked the bot or chat no longer exists`)
      } else {
        console.log(`Failed to send message to ${chatId}:`, error)
      }
    }

    return
  }
}