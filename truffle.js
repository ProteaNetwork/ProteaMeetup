// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')
require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const MNEMONIC = process.env.MNEMONIC;
const HDWalletProvider = require('truffle-hdwallet-provider');

const NETWORK_IDS = {
  // mainnet: 1,
  ropsten: 2,
  rinkeby: 4,
  kovan: 42
};


module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    rinkeby: {
      provider: new HDWalletProvider(MNEMONIC, 'https://rinkeby.infura.io/' + INFURA_API_KEY),
      network_id: 4,
      gas: 3000000,
      gasPrice: 21
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};

for (let networkName in NETWORK_IDS) {
  module.exports.networks[ networkName ] = {
    provider: new HDWalletProvider(MNEMONIC, 'https://' + networkName + '.infura.io/' + INFURA_API_KEY),
    network_id: NETWORK_IDS[networkName],
    gas: 6500000,
    gasPrice: 21
  };
}