const { SDK } = require("../sdk");

const run = async (wallet) => {
  const runners = [
    {
      entryPoint: require("../runners/ens").entryPoint,
      name: "ens-runner",
      description: "calculates karma delta based on ens name",
      op: 0,
      config: {
        wallet,
      },
    },
    {
      entryPoint: require("../runners/nonce-scorer").entryPoint,
      name: "nonce-runner",
      description: "nerfs karma if you have low no of txns",
      op: 1,
      config: {
        wallet,
      },
    },
    {
      entryPoint: require("../runners/portfolio").entryPoint,
      name: "portfolio-runner",
      description: "profiles your current portfolio and give you karma scores",
      op: 0,
      config: {
        wallet,
        maskScore: {},
      },
    },
    {
      entryPoint: require("../runners/governance").entryPoint,
      name: "governance-runner",
      description: "if you hold a defi governance tokens, you get more karma",
      op: 0,
      config: {
        wallet,
        useCache: true,
      },
    },
    {
      entryPoint: require("../runners/pools").entryPoint,
      name: "pools-runner",
      description: "if you hold top defi pool tokens, you get more karma",
      op: 0,
      config: {
        wallet,
        useCache: true,
      },
    },
    {
      entryPoint: require("../runners/aave-profiler").entryPoint,
      name: "aave-profiler",
      description:
        "profiles your current aave portfolio, your deposits and give you karma scores",
      op: 0,
      config: {
        wallet,
      },
    },
  ];
  return await SDK.calculateKarma(runners, 100);
};

module.exports = {
  run,
};
