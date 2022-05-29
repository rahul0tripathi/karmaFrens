const calculateKarma = async (
  runners,
  base = 0,
  startBlock = null,
  endBlock = null
) => {
  let calculatedKarma = parseFloat(base);
  for (let runner of runners) {
    const { entryPoint, config, name, description, op } = runner;
    let extendedConfig = {
      ...config,
      ...(startBlock ? startBlock : {}),
      ...(endBlock ? endBlock : {}),
    };
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
