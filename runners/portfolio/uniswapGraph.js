const BN = require("bn.js");
const { request, gql } = require("graphql-request");
const { AVERAGE_VOLUME_LENGTH } = require("./config");
const GRAPH_URL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
const getHighestVolume = async ({ excludeInitial = 10 }) => {
  try {
    const query = gql`
      {
        tokens(first:${AVERAGE_VOLUME_LENGTH}, orderBy: volumeUSD, orderDirection: desc) {
          id
          name
          volumeUSD
          decimals
        }
      }
    `;
    const response = await request(GRAPH_URL, query);
    if (excludeInitial > 0 && response.tokens.length) {
      response.tokens = response.tokens.slice(
        excludeInitial,
        response.tokens.length
      );
    }
    let total = new BN(0);
    for (let token of response.tokens) {
      total = total.add(new BN(parseFloat(token.volumeUSD), token.decimals));
    }
    console.log(
      `uniswap-graph: aggregated:`,
      total.toNumber(),
      "avg: ",
      total.div(new BN(response.tokens.length)).toNumber(),
      "highest: ",
      new BN(parseFloat(response.tokens[0].volumeUSD), 10).toNumber()
    );
    return total.div(new BN(response.tokens.length));
  } catch (error) {
    console.log(`uniswap-graph: failed to get highest volume token`, error);
    return new BN(0);
  }
};

const getTokenVolume = async (token = null) => {
  try {
    const query = gql`
          {
            tokens(where:{id:"${token}"}) {
              id
              name
              volumeUSD
              decimals
            }
          }
        `;
    const response = await request(GRAPH_URL, query);
    const volume = new BN(parseFloat(response.tokens[0].volumeUSD), 10);
    return volume;
  } catch (error) {
    console.log(`uniswap-graph: failed to get ${token} volume`);
    return new BN(0);
  }
};

module.exports = {
  getHighestVolume,
  getTokenVolume,
};
