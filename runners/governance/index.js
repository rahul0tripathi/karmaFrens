const { default: axios } = require("axios");
const BN = require("bn.js");
const { ethers } = require("ethers");
const { alchemy, provider, ERC20ABI } = require("../../utils");
const { TOP_N, STATIC_SCORE_GOV } = require("./config");
const getTopGovernanceTokens = async (cached = true) => {
  try {
    let tokenList = [];
    let data = require("../../cache/defillama.json");
    if (!cached) {
      const response = await axios.get("https://api.llama.fi/protocols");
      data = response.data;
    }
    for (let i = 0; i < TOP_N; i++) {
      if (data[i].address.startsWith("0x")) {
        tokenList.push(data[i].address);
      }
    }
    return tokenList;
  } catch (err) {
    console.log(
      `getTopGovernanceTokens: failed to fetch top governance tokens `,
      err?.message
    );
    return [];
  }
};
const getTokenBalancesValues = async (tokenList, wallet) => {
  let totalScore = 0;
  let balances = await alchemy.alchemy.getTokenBalances(wallet, tokenList);
  for (let balance of balances.tokenBalances) {
    if (new BN(balance.tokenBalance).toString() != "0") {
      totalScore += STATIC_SCORE_GOV;
      const contract = new ethers.Contract(
        balance.contractAddress,
        ERC20ABI,
        provider
      );
      const totalSuppy = await contract.totalSupply();
      let score = new BN(balance.tokenBalance)
        .div(new BN(totalSuppy.toString()))
        .toString();
      totalScore += score * 100;
    }
  }

  return totalScore;
};
const entryPoint = async (config) => {
  let delta = parseFloat(0);
  const {
    wallet,
    startBlock = null,
    endBlock = null,
    useCache = false,
  } = config;
  console.log(`governance: getting top ${TOP_N} governance tokens`);
  const tokenList = await getTopGovernanceTokens(useCache);
  if (tokenList.length === 0) return delta;
  const totalScore = await getTokenBalancesValues(tokenList, wallet);
  delta += parseFloat(totalScore);
  return delta;
};

module.exports = {
  entryPoint,
};
