require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_API_URL = process.env.QUICKNODE_API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: QUICKNODE_API_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
