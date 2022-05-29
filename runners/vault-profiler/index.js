const BN = require("bn.js");
const { alchemy } = require("../../utils");
const YEARN_VAULTS_V3 = [
  "0x04bC0Ab673d88aE9dbC9DA2380cB6B79C4BCa9aE",
  "0xE6354ed5bC4b393a5Aad09f21c46E101e692d447",
  "0x26EA744E5B887E5205727f55dFBE8685e3b21951",
];
const BRAHMA_VAULTS = ["0x1c4ceb52ab54a35f9d03fcc156a7c57f965e081e"];
const getUSDCVaultBalances = async (address) => {
  console.log(`vault-runner: get YEARN V3 Holders`);
  let totalBalances = 0;
  const yearnBalances = await alchemy.alchemy.getTokenBalances(
    address,
    YEARN_VAULTS_V3
  );
  console.log(`vault-runner: get PMUSDC Holders`);
  const bramhaPMUSDC = await alchemy.alchemy.getTokenBalances(
    address,
    BRAHMA_VAULTS
  );
  return [...yearnBalances.tokenBalances, ...bramhaPMUSDC.tokenBalances];
};

const entryPoint = async (config) => {
  let delta = parseFloat(0);
  const { wallet, useCache = true } = config;
  if (!wallet) {
    console.log(`vault-error: wallet not found in config`);
    return delta;
  }
  let hasInteractedWithVaults = false;
  const balances = await getUSDCVaultBalances(wallet);
  for (let bal of balances) {
    if (new BN(bal.tokenBalance).gt(new BN(0))) {
      hasInteractedWithVaults = true;
      // for usdc based vaults
      if (new BN(bal.tokenBalance).lt(new BN(100))) delta += 10;
    }
  }
  if (!hasInteractedWithVaults) {
    delta += 20;
  }
  console.log(`vault-runner-delta:`, delta);
  return delta;
};

module.exports = {
  entryPoint,
};
