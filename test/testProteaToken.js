const web3Abi = require('web3-eth-abi');

var ProteaToken = artifacts.require('./ProteaToken.sol');
var ProteaMeetupManager = artifacts.require('./ProteaMeetupManager.sol');
var ProteaMeetup = artifacts.require('./ProteaMeetup.sol');
const web3 = ProteaMeetup.web3;

const fs = require('fs');
const deployConfig = JSON.parse(fs.readFileSync('./config/deploy.json'));


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


contract('ProteaToken', (accounts) => {
    let proteaToken,
        tokenOwnerAddress,
        adminAddress,
        userAddress;

    tokenOwnerAddress = accounts[0];
    adminAddress = accounts[1];
    userAddress = accounts[2];
    beforeEach('setup contract for each test', async () => {
        proteaToken = await ProteaToken.new(name, tokenSymbol, decimalUnits, initialSupply, issuingAmount, {
            from: tokenOwnerAddress
        })
    })

    describe("Protea Token Functions", () => {
        it("should return a balance", async () => {

            const balance = (await proteaToken.balanceOf(tokenOwnerAddress)).toNumber();
            assert.isTrue(balance > 0, "contract has not deployed correctly");
        });

        it("should issue an initial token balance", async () => {
          let balance = (await proteaToken.balanceOf(userAddress)).toNumber();
          assert.isTrue(balance === 0, "account already has tokens");

          await proteaToken.claimGift({
            from: userAddress
          });
          balance = (await proteaToken.balanceOf(userAddress)).toNumber();

          assert.isTrue(balance === issuingAmount, "ClaimGift has not issued tokens");
        });


        it("should transfer tokens with data", async () => {

            let receiverContract = await ERC223Receiver.new(conferenceName, deposit, limitOfParticipants,
                coolingPeriod, proteaToken.address, encryption, {
                    from: adminAddress
                });
            // https://beresnev.pro/test-overloaded-solidity-functions-via-truffle/
            // Truffle unable to use overloaded functions, assuming target overload is last entry to the contract
            // Possible upgrade, include lodash to dynamically load abi function
            let targetAbi = proteaToken.contract.abi[proteaToken.contract.abi.length - 1];
            // 
            // Giving user some tokens, replace with ClaimGift
            await proteaToken.claimGift({
                from: userAddress
            });

            // Confirm send
            let balance = (await proteaToken.balanceOf(userAddress)).toNumber();
            assert.isTrue(balance === issuingAmount, "ClaimGift has not issued tokens");

            
            // Begin creating custom transaction call
            const transferMethodTransactionData = web3Abi.encodeFunctionCall(
                targetAbi, [
                    receiverContract.address,
                    issuingAmount,
                    web3.toHex("0x00aaff")
                ]
            );
          
            await web3.eth.sendTransaction({
                from: userAddress,
                gas: 170000,
                to: erc223Contract.address,
                data: transferMethodTransactionData,
                value: 0
            });

            let conferenceBalance = (await proteaToken.balanceOf(receiverContract.address)).toNumber();
            assert.isTrue(conferenceBalance === issuingAmount, "Transfer to contract failed");
        });
    })
   

});
