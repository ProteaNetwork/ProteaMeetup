pragma solidity ^0.4.21;

import "./ProteaMeetup.sol";
import "../MeetupLibrary.sol";

contract ProteaMeetupManager {

    address private tokenContract;

    event ProteaMeetupDeployed(address partyAddress);

    mapping(address => address[]) internal userEvents;
    // State: 0: Active, 1: Ended, 2: Cancelled 
    mapping(address => uint) internal eventStates;
    // Event => Attendees
    mapping(address => address[]) internal attendees;
    // Event => Attendee data
    mapping(address => mapping(address => MeetupLibrary.Attendee)) internal attendeeData;

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

    function getEventState(address _event) view public returns(uint state) {
        state = eventStates[_event];
    }

    // Consider making specific functions
    function setEventState(uint _state) external {
        eventStates[msg.sender] = _state;
    }

    // Need to consider security here
    // function getAttendee(address _event, address _address) view public returns(MeetupLibrary.Attendee attendee) {
    function getAttendee(address _event, address _address) view public returns(string identity, uint8 state) {
        identity = attendeeData[_event][_address].identity;
        state = attendeeData[_event][_address].state;
    }

    function getAttendeeState(address _event, address _address) view public returns(uint state) {
        state = attendeeData[_event][_address].state;
    }
    
    function getAttendeeIdentity(address _event, address _address) view public returns(string identity) {
        identity = attendeeData[_event][_address].identity;
    }

    function registerAttendee(address _address, string _identity) external returns(bool success) {
        MeetupLibrary.Attendee memory attendee = MeetupLibrary.Attendee(_identity, 1);
        attendees[msg.sender].push(_address);
        attendeeData[msg.sender][_address] = attendee;
        success = true;
    }

    function confirmAttendee(address _address) external returns(bool success){
        attendeeData[msg.sender][_address].state = 2;
        success = true;
    }

    function confirmPaid(address _address) external returns(bool success){
        attendeeData[msg.sender][_address].state = 3;
        success = true;
    }
}