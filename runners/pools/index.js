const { default: axios } = require("axios");
const BN = require("bn.js");
const { ethers } = require("ethers");
const { alchemy, ERC20ABI, provider } = require("../../utils");
const { TOP_N, MIN_THRESHOLD } = require("./const");

const getTopTokenPools = async (address, cache = true) => {
  let topPools = require("../../cache/pools.json");
  if (!cache) {
    const response = await axios.get(
      `https://api.blocklytics.org/pools/v1/exchanges?key=AIzaSyDn7LYCJuJK6fM37nEpwVTsXdQ5eok0wQk&excludeEmpty=true&platform=uniswap,uniswap-v2,curve,balancer,mooniswap,sushiswap&limit=${TOP_N}&offset=0&orderBy=usdLiquidity&direction=desc`
    );
    topPools = response.data;
  }
  const topPoolList = [];
  for (let i = 0; i < TOP_N; i++) {
    topPoolList.push(topPools.results[i].ownershipToken);
  }
  return topPoolList;
};
const getPoolBalance = async (poolAddress, wallet) => {
  const contract = new ethers.Contract(poolAddress, ERC20ABI, provider);
  return await contract.balanceOf(wallet);
};
const entryPoint = async (config) => {
  let delta = parseFloat(0);
  const { wallet, useCache = true } = config;
  if (!wallet) {
    console.log(`pool-error: wallet not found in config`);
    return delta;
  }
  const tokenList = await getTopTokenPools(wallet, useCache);
  for (let i = 0; i < tokenList.length; i++) {
    const balance = await getPoolBalance(tokenList[i], wallet);
    console.log(`pool-balance: ${tokenList[i]} :`, balance.toString());
    if (new BN(balance.toString()).gt(new BN(MIN_THRESHOLD))) {
      delta += 100 / (i + 1);
    }
  }
  console.log(`pool-runner-delta:`, delta);
  return delta;
};

module.exports = {
  entryPoint,
};
