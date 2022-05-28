const BN = require("bn.js");
const ether = require("ethers");
const { BLOCK_DIFF, THRESHOLD } = require("./config");
const { ERC20ABI } = require("./constants");
const provider = new ether.providers.AlchemyProvider(
  null,
  "mc_Wvzd1suoiZpyeme6c6_YEgNf4SImy"
);
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const validateBalance = async ({
  wallet = null,
  balance = null,
  token = null,
  beforeBlock = 0,
}) => {
  try {
    if (beforeBlock == 0) {
      beforeBlock = await createAlchemyWeb3(
        `https://eth-mainnet.alchemyapi.io/v2/mc_Wvzd1suoiZpyeme6c6_YEgNf4SImy`
      ).eth.getBlockNumber();
    }
    const contract = new ether.Contract(token, ERC20ABI, provider);
    const bal = await contract.balanceOf(wallet, {
      blockTag: beforeBlock - BLOCK_DIFF,
    });
    if (new BN(bal.toString()).div(balance).toNumber() >= THRESHOLD) {
      return true;
    }
  } catch (err) {
    console.log(`validateBalance: failed to validate balance`, err);
  }
  return false;
};
module.exports = {
  validateBalance,
};
