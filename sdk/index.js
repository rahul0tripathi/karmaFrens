const calculateKarma = async (runners) => {
  let calculatedKarma = parseFloat(0);
  for (let runner of runners) {
    const { entryPoint, config, name, description, op } = runner;
    console.log(`invoking runner ${name}: ${description}`);
    if (!entryPoint) {
      console.log(`entrypoint not found for runner ${name}`);
    }
    try {
      console.time(`${name}-time`);
      const delta = await entryPoint(config);
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
      console.log(`error invoking runner ${name}: ${error?.message()}`);
      continue;
    }
  }
  return calculatedKarma;
};

module.exports = {
  SDK: {
    calculateKarma,
  },
};
