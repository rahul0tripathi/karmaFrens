const { default: axios } = require("axios");
const { alchemy } = require("../../utils");
const { nerfScore } = require("./nerf-table");

const getWalletNonce = async (
  address = null,
  startBlock = null,
  endBlock = null
) => {
  try {
    const count = await alchemy.eth.getTransactionCount(address);
    return parseInt(count);
  } catch (error) {
    console.log(`nonce-score: failed to fetch txns for ${address}`);
    return -1;
  }
};
const entryPoint = async (config) => {
  let delta = parseFloat(0);
  const { wallet, startBlock = null, endBlock = null } = config;
  if (!wallet) {
    console.log(`nonce-score: wallet not found in config`);
    return delta;
  }
  const txnCount = await getWalletNonce(wallet, startBlock, endBlock);
  if (txnCount < 0) return delta;
  delta = nerfScore(txnCount);
  console.log(`nonce-score-delta:`, delta);
  return delta;
};

module.exports = {
  entryPoint,
};
