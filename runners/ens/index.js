const { request, gql } = require("graphql-request");
const moment = require("moment");
const { CONSTANTS } = require("./config");
const getEnsData = async (address = null) => {
  const query = gql`
  {
    domains(where:{owner:"${address}"}) {
                 id,
                 createdAt
        }
  }
`;
  let resolved = {
    createdAt: null,
    exists: false,
  };
  try {
    const response = await request(
      "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
      query
    );
    if (response.domains.length > 0) {
      resolved.exists = true;
      resolved.createdAt = moment(
        parseInt(response.domains[0].createdAt) * 1000
      );
    }
  } catch (err) {
    console.log(`ens-error: ${err}`);
  }
  console.log(`ens-resolved:`, resolved);
  return resolved;
};
const entryPoint = async (config) => {
  let delta = parseFloat(0);
  const { wallet } = config;
  if (!wallet) {
    console.log(`ens-error: wallet not found in config`);
    return delta;
  }
  const ensData = await getEnsData(wallet);
  if (ensData.exists) {
    // adding base score
    delta += CONSTANTS.BASE_SCORE;
    let timeDelta = moment().diff(ensData.createdAt, "months", true);
    // adding score based on time the ens name was held
    delta += timeDelta * CONSTANTS.PER_MONTH_SCALE;
  }
  console.log(`ens-delta:`, delta);
  return delta;
};

module.exports = {
  entryPoint,
};
