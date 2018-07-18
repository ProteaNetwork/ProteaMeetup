pragma solidity ^0.4.21;

library MeetupLibrary {
    // State: 0: Inactive, 1: Registered, 2: Confirmed, 3: Paid
    struct Attendee {
        string identity;
        uint8 state;
    }

    // Need to test if needed
    // State: 0: Inactive, 1: Active, 2: Ended, 3: Cancelled 
    struct Meetup{
        address token;
        uint8 state;
    }
}