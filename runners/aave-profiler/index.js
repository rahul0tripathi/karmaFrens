const { request, gql } = require("graphql-request");
const { getCurrentAssets } = require("../portfolio");
const {
  getTokenVolume,
  getHighestVolume,
} = require("../portfolio/uniswapGraph");
const { NORMALIZE } = require("./config");
const GRAPH_URL = "https://api.thegraph.com/subgraphs/name/aave/protocol-v2";
const getTokenMetadata = async (token) => {
  try {
    const query = gql`
      {
        atoken(id:"${token}"){
            id
            underlyingAssetAddress
          }
      }
    `;
    const response = await request(GRAPH_URL, query);
    return response?.atoken?.underlyingAssetAddress;
  } catch (err) {
    console.log(`aave-error: ${err}`);
    return null;
  }
};
const getATokenScore = async (token, highestVolume) => {
  let score = parseInt(0);
  const underlyingTkn = await getTokenMetadata(token.tokenInfo.address);
  if (underlyingTkn) {
    console.log(
      `aave-score: ${token.tokenInfo.name} has underlying token ${underlyingTkn}`
    );
    let currentVol = await getTokenVolume(underlyingTkn);
    if (currentVol.toNumber() === 0) return 0.0;
    return parseFloat(currentVol.toNumber() / highestVolume.toNumber()).toFixed(
      4
    );
  } else {
    return 0.0;
  }
};
const entryPoint = async (config) => {
  let delta = parseFloat(0);
  const { wallet, useCache = true } = config;
  if (!wallet) {
    console.log(`aave-error: wallet not found in config`);
    return delta;
  }
  const tokenHoldings = await getCurrentAssets(wallet, useCache);
  const highestVolume = await getHighestVolume();
  for (let tkn of tokenHoldings) {
    let tokenScore = await getATokenScore(tkn, highestVolume);
    console.log(
      `aave-delta: token score for ${tkn.tokenInfo.name} `,
      tokenScore
    );
    delta += parseFloat(tokenScore);
  }
  delta *= NORMALIZE;
  console.log(`aave-runner-delta:`, delta);
  // normalize based on txn counts as well
  return delta;
};
module.exports = {
  entryPoint,
};
