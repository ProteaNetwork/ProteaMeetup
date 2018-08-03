const ProteaMeetup = artifacts.require("ProteaMeetup");
const ProteaMeetupManager = artifacts.require("ProteaMeetupManager")
const ProteaToken = artifacts.require("ProteaToken");
const VersionManager = artifacts.require("VersionManager");

const fs = require('fs');
const deployConfig = JSON.parse(fs.readFileSync('../config/deploy.json'));


const initialSupply = deployConfig.ProteaToken.initialSupply;
const name = deployConfig.ProteaToken.name;
const decimalUnits = deployConfig.ProteaToken.decimals;
const issuingAmount = deployConfig.ProteaToken.issuingAmount;
const tokenSymbol = deployConfig.ProteaToken.symbol;

const conferenceName = deployConfig.ProteaMeetup.name;
const deposit = deployConfig.ProteaMeetup.deposit;
const limitOfParticipants = deployConfig.ProteaMeetup.limitOfParticipants;
const coolingPeriod = deployConfig.ProteaMeetup.coolingPeriod;
const encryption = deployConfig.ProteaMeetup.encryption;


module.exports = async function (deployer, network, accounts) {
    await Promise.all([
        deployer.deploy(ProteaToken, name, tokenSymbol, decimalUnits, initialSupply, issuingAmount),
        deployer.deploy(VersionManager, "Event Manager Version Manager"),
    ])   

    await deployer.deploy(ProteaMeetupManager, ProteaToken.address);

    const factoryVersionInstance = await VersionManager.deployed();

    await factoryVersionInstance.setVersion(ProteaToken.address, ProteaMeetupManager.address);

    // let event = await deployer.deploy(ProteaMeetup, conferenceName, deposit, limitOfParticipants,
    //     coolingPeriod, ERC223Standard.address, encryption);
}
