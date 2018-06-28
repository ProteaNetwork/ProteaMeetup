const ProteaParty = artifacts.require("ProteaParty");
const ProteaPartyFactory = artifacts.require("ProteaPartyFactory")
const ERC223Standard = artifacts.require("ERC223StandardToken");

const fs = require('fs');
const deployConfig = JSON.parse(fs.readFileSync('../config/deploy.json'));


const initialSupply = deployConfig.ERC223CompliantToken.initialSupply;
const name = deployConfig.ERC223CompliantToken.name;
const decimalUnits = deployConfig.ERC223CompliantToken.decimals;
const issuingAmount = deployConfig.ERC223CompliantToken.issuingAmount;
const tokenSymbol = deployConfig.ERC223CompliantToken.symbol;

const conferenceName = deployConfig.ProteaParty.name;
const deposit = deployConfig.ProteaParty.deposit;
const limitOfParticipants = deployConfig.ProteaParty.limitOfParticipants;
const coolingPeriod = deployConfig.ProteaParty.coolingPeriod;
const encryption = deployConfig.ProteaParty.encryption;


module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(ERC223Standard, name, tokenSymbol, decimalUnits, initialSupply, issuingAmount);

    await deployer.deploy(ProteaPartyFactory, ERC223Standard.address);

    // let event = await deployer.deploy(ProteaParty, conferenceName, deposit, limitOfParticipants,
    //     coolingPeriod, ERC223Standard.address, encryption);
}
