const ProteaMeetup = artifacts.require("ProteaMeetup");
const ProteaMeetupFactory = artifacts.require("ProteaMeetupFactory")
const ERC223Standard = artifacts.require("ERC223StandardToken");

const fs = require('fs');
const deployConfig = JSON.parse(fs.readFileSync('../config/deploy.json'));


const initialSupply = deployConfig.ERC223CompliantToken.initialSupply;
const name = deployConfig.ERC223CompliantToken.name;
const decimalUnits = deployConfig.ERC223CompliantToken.decimals;
const issuingAmount = deployConfig.ERC223CompliantToken.issuingAmount;
const tokenSymbol = deployConfig.ERC223CompliantToken.symbol;

const conferenceName = deployConfig.ProteaMeetup.name;
const deposit = deployConfig.ProteaMeetup.deposit;
const limitOfParticipants = deployConfig.ProteaMeetup.limitOfParticipants;
const coolingPeriod = deployConfig.ProteaMeetup.coolingPeriod;
const encryption = deployConfig.ProteaMeetup.encryption;


module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(ERC223Standard, name, tokenSymbol, decimalUnits, initialSupply, issuingAmount);

    await deployer.deploy(ProteaMeetupFactory, ERC223Standard.address);

    // let event = await deployer.deploy(ProteaMeetup, conferenceName, deposit, limitOfParticipants,
    //     coolingPeriod, ERC223Standard.address, encryption);
}
