pragma solidity ^0.4.21;

import "./ProteaMeetup.sol";
import "../MeetupLibrary.sol";

contract ProteaMeetupManager {

    address private tokenContract;

    event ProteaMeetupDeployed(address partyAddress);

    mapping(address => address[]) internal userEvents;
    // State: 0: Active, 1: Ended, 2: Cancelled 
    mapping(address => uint) internal eventStates;
    mapping(address => mapping(address => MeetupLibrary.Attendee[])) internal attendees;

    constructor(address _tokenContract) public{
        tokenContract = _tokenContract;
    }

    function deployMeetup(
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
        
        userEvents[msg.sender].push(address(meetup));

        emit ProteaMeetupDeployed(address(meetup));
    }

    function getRegisteredToken() view public returns(address) {
        return tokenContract;
    }

    function getUserEvents(address _adminAddress) view public returns(address[]) {
        return userEvents[_adminAddress];
    }

    function getEventState(address _event) view public {
        return eventStates[_event];
    }

    // Consider making specific functions
    function setEventState(uint _state) external {
        eventStates[msg.sender] = _state;
    }

    // Need to consider security here
    function getAttendee(address _event, address _address) view public {
        return attendees[_event][_address];
    }

    function getAttendeeState(address _event, address _address) view public {
        return attendees[_event][_address].state;
    }
    
    function getAttendeeIdentity(address _event, address _address) view public {
        return attendees[_event][_address].identity;
    }

    function registerAttendee(address _address, string _identity) external {
        MeetupLibrary.Attendee storage attendee = new MeetupLibrary.Attendee(_identity, 1);
        attendees[msg.sender][_address] = attendee;
    }

    function confirmAttendee(address _address) external {
        attendees[msg.sender][_address].state = 2;
    }

    function confirmPaid(address _address) external {
        attendees[msg.sender][_address].state = 3;
    }
}