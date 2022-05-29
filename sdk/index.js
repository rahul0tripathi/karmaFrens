const { calculatedKarmaKey } = require("../utils");

const calculateKarma = async (
  runners,
  base = 0,
  startBlock = null,
  endBlock = null
) => {
  let calculatedKarma = parseFloat(base);
  let karmaBank = {};
  for (let runner of runners) {
    const {
      entryPoint,
      config,
      name,
      description,
      op,
      isConsumer = false,
    } = runner;
    let extendedConfig = {
      ...config,
      ...(startBlock ? startBlock : {}),
      ...(endBlock ? endBlock : {}),
    };
    if (isConsumer) {
      console.log(`invoking consumer ${name}`);
      await entryPoint(extendedConfig, karmaBank);
      continue;
    }
    console.log(`invoking runner ${name}: ${description}`);
    if (!entryPoint) {
      console.log(`entrypoint not found for runner ${name}`);
    }
    try {
      console.time(`${name}-time`);
      const delta = await entryPoint(extendedConfig);
      console.timeEnd(`${name}-time`);
      console.log(`runner ${name} returned delta: ${delta}`);
      switch (op) {
        case 0:
          calculatedKarma += parseFloat(delta);
          break;
        case 1:
          calculatedKarma -= parseFloat(delta);
          break;
        default:
          console.log(`unknown operation ${op} for runner ${name}`);
      }
      if (name != calculatedKarmaKey) {
        karmaBank[name] = { delta, op };
      }
      karmaBank[calculatedKarmaKey] = calculatedKarma;
    } catch (error) {
      console.log(`error invoking runner ${name}: ${error}`);
      continue;
    }
  }
  if (calculatedKarma < 1) calculatedKarma = parseFloat(0);
  return calculatedKarma;
};

module.exports = {
  SDK: {
    calculateKarma,
  },
};
