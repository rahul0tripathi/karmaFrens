const { getCurrentAssets } = require("../../runners/portfolio");
const { calculatedKarmaKey } = require("../../utils");
const get0LiquidityCoins = async (wallet) => {
  const holdings = await getCurrentAssets(wallet);
};
const entryPoint = async (config, karmaBank) => {
  const { wallet } = config;
  if (karmaBank[calculatedKarmaKey] > 100) {
    // get holders of tokens with low liquidity
    // get their karma is good aswell maybe the user is holding this token 
  }
};
