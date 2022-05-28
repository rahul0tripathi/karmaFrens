const BN = require("bn.js");
const ether = require("ethers");
const { alchemy } = require("../../utils");
const { BLOCK_DIFF, THRESHOLD } = require("./config");
const { ERC20ABI, provider } = require("../../utils");

const validateBalance = async ({
  wallet = null,
  balance = null,
  token = null,
  beforeBlock = 0,
}) => {
  try {
    if (beforeBlock == 0) {
      beforeBlock = alchemy.eth.getBlockNumber();
    }
    const contract = new ether.Contract(
      token,
      ERC20ABI,
      ether.ethers.getDefaultProvider()
    );
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
