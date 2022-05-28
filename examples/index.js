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
];

const run = async () => {
  const calculatedValue = await SDK.calculateKarma(runners);
  console.log("========================================");
  console.log("calculated Karma frens => " + calculatedValue.toFixed(12));
};

run();
