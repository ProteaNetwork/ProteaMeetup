pragma solidity ^0.4.20;

import "./ProteaMeetup.sol";

contract ProteaMeetupFactory {

    address private tokenContract;

    event ProteaMeetupDeployed(address meetupAddress);

    mapping(address => address[]) deployed;

    constructor(address _tokenContract) public{
        tokenContract = _tokenContract;
    }

    function deploymeetup(
        string _name, 
        uint256 _deposit, 
        uint _limitOfParticipants, 
        uint _coolingPeriod, 
        string _encryption
        ) public {
        
        ProteaMeetup meetup = new ProteaMeetup(
            _name, 
            _deposit, 
            _limitOfParticipants, 
            _coolingPeriod, 
            tokenContract, 
            _encryption);
        meetup.transferOwnership(msg.sender);
        
        deployed[msg.sender].push(address(meetup));

        emit ProteaMeetupDeployed(address(meetup));
    }

    function getRegisteredToken() view public returns(address) {
        return tokenContract;
    }

    function getUserEvents(address _adminAddress) view public returns(address[]) {
        return deployed[_adminAddress];
    }
}