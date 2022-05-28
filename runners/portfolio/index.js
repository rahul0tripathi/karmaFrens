const { default: axios } = require("axios");
const BN = require("bn.js");
const { NORMALIZE } = require("./constants");
const { getHighestVolume, getTokenVolume } = require("./uniswapGraph");
const { validateBalance } = require("./validateBalance");

const getCurrentAssets = async (address = null) => {
  try {
    const response = await axios.get(
      `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
    );
    return response.data.tokens;
  } catch (error) {
    console.log(
      `portfolio: failed to fetch assets for ${address}`,
      error.message()
    );
    return [];
  }
};

const entryPoint = async (config) => {
  let delta = parseFloat(0);
  const { wallet, startBlock = null, endBlock = null, maskScore = {} } = config;
  if (!wallet) {
    console.log(`portfolio: wallet not found in config`);
    return delta;
  }
  // get current erc20
  const holdingList = await getCurrentAssets(wallet);
  if (holdingList.length === 0) return delta;
  const highestVolume = await getHighestVolume(holdingList);

  for (let token of holdingList) {
    console.log(`portfolio: getting info for ${token.tokenInfo.address}`);
    if (
      token.rawBalance > 0 &&
      !(await validateBalance({
        wallet,
        token: token.tokenInfo.address,
        balance: new BN(token.rawBalance),
        beforeBlock: endBlock ? endBlock : 0,
      }))
    )
      continue;
    let tokenScore = maskScore[token.tokenInfo.address]
      ? parseFloat(maskScore[token.tokenInfo.address])
      : await (async () => {
          let currentVol = await getTokenVolume(token.tokenInfo.address);
          if (currentVol.toNumber() === 0) return 0.0;
          return parseFloat(
            currentVol.toNumber() / highestVolume.toNumber()
          ).toFixed(4);
        })();

    console.log(
      `portfolio-delta: token score for ${token.tokenInfo.name} `,
      tokenScore
    );
    delta += parseFloat(tokenScore);
  }
  delta *= NORMALIZE;
  console.log(`portfolio-delta:`, delta);
  return delta;
};

module.exports = {
  entryPoint,
};
