import { InlineKeyboardMarkup } from 'node-telegram-bot-api'

export const createTxSubMenu = (tokenSymbol: string, tokenMint: string) => {
  const txSubMenu: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        {
          text: `🐴 Buy on dogeebot: ${tokenSymbol}`,
          url: `https://t.me/dogeebot_bot?start=rt_17290579723103_${tokenMint}`,
        },
      ],
      [
        {
          text: `🐴 Buy on Trojan: ${tokenSymbol}`,
          url: `https://t.me/solana_trojanbot?start=r-handicatbt-${tokenMint}`,
        },
      ],
      [
        { text: `🐶 BonkBot: ${tokenSymbol}`, url: `https://t.me/bonkbot_bot?start=ref_3au54_ca_${tokenMint}` },
        {
          text: `🐸 PepeBoost: ${tokenSymbol}`,
          url: `https://t.me/pepeboost_sol_bot?start=ref_03pbvu_ca_${tokenMint}`,
        },
      ],
    ],
  }

  return txSubMenu
}
