const TokenConference = artifacts.require("TokenConference");
const ERC223Standard = artifacts.require("ERC223StandardToken");

const fs = require('fs');
const deployConfig = JSON.parse(fs.readFileSync('../config/deploy.json'));


const initialSupply = deployConfig.ERC223CompliantToken.initialSupply;
const name = deployConfig.ERC223CompliantToken.name;
const decimalUnits = deployConfig.ERC223CompliantToken.decimals;
const issuingAmount = deployConfig.ERC223CompliantToken.issuingAmount;
const tokenSymbol = deployConfig.ERC223CompliantToken.symbol;

const conferenceName = deployConfig.tokenConference.name;
const deposit = deployConfig.tokenConference.deposit;
const limitOfParticipants = deployConfig.tokenConference.limitOfParticipants;
const coolingPeriod = deployConfig.tokenConference.coolingPeriod;
const encryption = deployConfig.tokenConference.encryption;


module.exports = function (deployer, network, accounts) {
    deployer.deploy(ERC223Standard,name, tokenSymbol, decimalUnits, initialSupply, issuingAmount,{from: accounts[0]}).then(() => {
        return deployer.deploy(TokenConference, conferenceName, deposit, limitOfParticipants,
            coolingPeriod, ERC223Standard.address, encryption, {from: accounts[1]}) 
    })
};