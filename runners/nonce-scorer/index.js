const { default: axios } = require("axios");
const { nerfScore } = require("./nerf-table");

const getWalletNonce = async (
  address = null,
  startBlock = null,
  endBlock = null
) => {
  try {
    const response = await axios.get(
      `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
    );
    return parseInt(response.data.countTxs);
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

// entryPoint({
//   wallet:"0x73BCEb1Cd57C711feaC4224D062b0F6ff338501e"
// })

module.exports = {
  entryPoint,
};
