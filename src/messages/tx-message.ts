import { FormatNumbers } from '../lib/format-numbers'
import { NativeParserInterface } from '../types/general-interfaces'

export class TxMessages {
  constructor() {}

  static txMadeMessage(
    message: NativeParserInterface,
    tokenMarketCap?: string | undefined,
    walletName?: string,
  ): string {
    console.log('MESSAGE', message)
    console.log('TOKEN MARKET CAP', tokenMarketCap)
    console.log('WALLET NAME', walletName)
    const owner = message.owner
    const amountOut = message.tokenTransfers.tokenAmountOut
    const tokenOut = message.tokenTransfers.tokenOutSymbol
    const amountIn = message.tokenTransfers.tokenAmountIn
    const tokenIn = message.tokenTransfers.tokenInSymbol

    const truncatedOwner = `${owner.slice(0, 4)}...${owner.slice(-4)}`

    const solscanAddressUrl = `https://solscan.io/account/${owner}`
    const solscanTokenOutUrl = `https://solscan.io/token/${message.tokenTransfers.tokenOutMint}`
    const solscanTokenInUrl = `https://solscan.io/token/${message.tokenTransfers.tokenInMint}`
    const solscanTxUrl = `https://solscan.io/tx/${message.signature}`
    const tokenInMint = message.tokenTransfers.tokenInMint
    const tokenOutMint = message.tokenTransfers.tokenOutMint

    const solPrice = Number(message.solPrice)

    const amountInUsd = message.type === 'buy' ? Number(amountOut) * solPrice : Number(amountIn) * solPrice
    // const fixedUsdAmount = amountInUsd < 0.01 ? amountInUsd.toFixed(6) : amountInUsd.toFixed(2)
    const fixedUsdAmount = FormatNumbers.formatPrice(amountInUsd)

    const tokenMintToTrack = message.type === 'buy' ? tokenInMint : tokenOutMint

    const gmgnLink = `<a href="https://gmgn.ai/sol/token/${tokenMintToTrack}">GMGN</a>`
    const beLink = `<a href="https://birdeye.so/token/${tokenMintToTrack}?chain=solana">BE</a>`
    const dsLink = `<a href="https://dexscreener.com/solana/${tokenMintToTrack}">DS</a>`
    const phLink = `<a href="https://photon-sol.tinyastro.io/en/lp/${tokenMintToTrack}">PH</a>`

    const marketCapText = tokenMarketCap
      ? `💣 ${message.type === 'buy' ? `<a href="${solscanTokenInUrl}">#${tokenIn}</a>` : `<a href="${solscanTokenOutUrl}">#${tokenOut}</a>`} | <b>MC: $${tokenMarketCap}</b> | ${gmgnLink} • ${beLink} • ${dsLink} • ${phLink}`
      : ''

    const messageText = `
${message.type === 'buy' ? '🟢' : '🔴'} <a href="${solscanTxUrl}">${message.type?.toUpperCase()} ${message.type === 'buy' ? `${tokenIn}` : `${tokenOut}`}</a> on ${message.platform!.toUpperCase()}
<b>💎 ${walletName !== '' ? walletName : truncatedOwner}</b>\n
💎 <a href="${solscanAddressUrl}">${walletName !== '' ? walletName : truncatedOwner}</a> swapped <b>${amountOut}</b>${message.type === 'sell' ? ` ($${fixedUsdAmount})` : ''} <a href="${solscanTokenOutUrl}">${tokenOut}</a> for <b>${amountIn}</b>${message.type === 'buy' ? ` ($${fixedUsdAmount})` : ''} <a href="${solscanTokenInUrl}">${tokenIn}</a> @$${message.swappedTokenPrice?.toFixed(7)}
${marketCapText}
<code>${tokenMintToTrack}</code>
`
    console.log(messageText)

    const newMessageText = `<a href="https://gmgn.ai/sol/address/${owner}">[${walletName}]</a>
    ${message.type == 'buy' ? '🟢' : '🔴'} ${message.type?.toUpperCase()} ${message.type === 'buy' ? `${amountOut} ${tokenOut}` : `${amountIn} ${tokenIn}`} 
    Token: ${message.type === 'buy' ? `${amountIn} <a href="https://gmgn.ai/sol/token/${tokenIn}">${tokenIn}</a>` : `${amountOut} <a href="https://gmgn.ai/sol/token/${tokenOut}">${tokenOut}</a>`}
    Price: $${message.swappedTokenPrice?.toFixed(7)}
    MCAP: $${tokenMarketCap}
    Platform: ${message.platform!.toUpperCase()}
    `;
    console.log(newMessageText)
    return newMessageText
  }

  static tokenMintedMessage(message: NativeParserInterface, walletName?: string): string {
    const owner = message.owner
    const amountOut = message.tokenTransfers.tokenAmountOut
    const tokenOut = message.tokenTransfers.tokenOutSymbol
    const amountIn = message.tokenTransfers.tokenAmountIn
    const tokenIn = message.tokenTransfers.tokenInSymbol

    const truncatedOwner = `${owner.slice(0, 4)}...${owner.slice(-4)}`

    const solscanAddressUrl = `https://solscan.io/account/${owner}`
    const solscanTokenOutUrl = `https://solscan.io/token/${message.tokenTransfers.tokenOutMint}`
    const solscanTokenInUrl = `https://solscan.io/token/${message.tokenTransfers.tokenInMint}`
    const solscanTxUrl = `https://solscan.io/tx/${message.signature}`
    const tokenInMint = message.tokenTransfers.tokenInMint

    const solPrice = Number(message.solPrice)

    const amountInUsd = message.type === 'buy' ? Number(amountOut) * solPrice : Number(amountIn) * solPrice
    const fixedUsdAmount = amountInUsd < 0.01 ? amountInUsd.toFixed(6) : amountInUsd.toFixed(2)

    const tokenMintToTrack = tokenInMint

    const gmgnLink = `<a href="https://gmgn.ai/sol/token/${tokenMintToTrack}">GMGN</a>`
    const beLink = `<a href="https://birdeye.so/token/${tokenMintToTrack}?chain=solana">BE</a>`
    const dsLink = `<a href="https://dexscreener.com/solana/${tokenMintToTrack}">DS</a>`
    const phLink = `<a href="https://photon-sol.tinyastro.io/en/lp/${tokenMintToTrack}">PH</a>`

    const messageText = `
⭐🔁 <a href="${solscanTxUrl}">SWAP</a> on PUMPFUN
<b>💎 ${walletName !== '' ? walletName : truncatedOwner}</b>\n
💎 <a href="${solscanAddressUrl}">${walletName !== '' ? walletName : truncatedOwner}</a> minted and swapped <b>${amountOut}</b><a href="${solscanTokenOutUrl}">${tokenOut}</a> for <b>${amountIn}</b>($${fixedUsdAmount}) <a href="${solscanTokenInUrl}">${tokenIn}</a> 

<b>💣 ${tokenIn}</b>| ${gmgnLink} • ${beLink} • ${dsLink} • ${phLink}

<code>${tokenMintToTrack}</code>   
`
    return messageText
  }
}