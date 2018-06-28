pragma solidity ^0.4.20;

import "./ProteaParty.sol";

contract ProteaPartyFactory {

    address private tokenContract;

    event ProteaPartyDeployed(address partyAddress);

    mapping(address => address[]) deployed;

    constructor(address _tokenContract) public{
        tokenContract = _tokenContract;
    }

    function deployParty(
        string _name, 
        uint256 _deposit, 
        uint _limitOfParticipants, 
        uint _coolingPeriod, 
        string _encryption
        ) public {
        
        ProteaParty party = new ProteaParty(
            _name, 
            _deposit, 
            _limitOfParticipants, 
            _coolingPeriod, 
            tokenContract, 
            _encryption);
        
        deployed[msg.sender].push(address(party));

        emit ProteaPartyDeployed(address(party));
    }

    function getRegisteredToken() view public returns(address) {
        return tokenContract;
    }

    function getUserEvents(address _adminAddress) view public returns(address[]) {
        return deployed[_adminAddress];
    }
}