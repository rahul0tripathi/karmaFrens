const { SDK } = require("../sdk");
const runners = [
  {
    entryPoint: require("../runners/ens").entryPoint,
    name: "ens-runner",
    description: "calculates karma delta based on ens name",
    op: 0,
    config: {
      wallet: "0xce90e2e1746940fa0e89b88947cd3495f354fcf8",
    },
  },
  {
    entryPoint: require("../runners/nonce-scorer").entryPoint,
    name: "nonce-runner",
    description: "nerfs karma if you have low no of txns",
    op: 1,
    config: {
      wallet: "0x73BCEb1Cd57C711feaC4224D062b0F6ff338501e",
    },
  },
  {
    entryPoint: require("../runners/portfolio").entryPoint,
    name: "portfolio-runner",
    description: "profiles your current portfolio and give you karma scores",
    op: 0,
    config: {
      wallet: "0x72238a2Aaf3Da7e650f04252cd9cED5C26d9D478",
      maskScore: {},
    },
  },
  {
    entryPoint: require("../runners/governance").entryPoint,
    name: "governance-runner",
    description: "if you hold a defi governance tokens, you get more karma",
    op: 0,
    config: {
      wallet: "0x000000000dFDe7deaF24138722987c9a6991e2D4",
      useCache: true,
    },
  },
  {
    entryPoint: require("../runners/pools").entryPoint,
    name: "pools-runner",
    description: "if you hold top defi pool tokens, you get more karma",
    op: 0,
    config: {
      wallet: "0x367a739ccC69940aF740590a7D533Ef8f96f282a",
      useCache: true,
    },
  },
  {
    entryPoint: require("../runners/aave-profiler").entryPoint,
    name: "aave-profiler",
    description:
      "profiles your current aave portfolio, your deposit patterns and give you karma scores",
    op: 0,
    config: {
      wallet: "0xf83E546BD2959c22F1715ECafFC03d39b8d0Fa96",
    },
  },
];
const run = async () => {
  const calculatedValue = await SDK.calculateKarma(runners, 100);
  console.log("========================================");
  console.log("calculated Karma frens => " + calculatedValue.toFixed(12));
};

run();
