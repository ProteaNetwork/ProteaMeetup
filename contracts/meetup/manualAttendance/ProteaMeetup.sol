pragma solidity ^0.4.21;

import "../../utils/GroupAdmin.sol";
import "../../token/ProteaToken.sol";
import "../../ERC223/ERC223Receiver.sol";
import "../MeetupLibrary.sol";
import "./ProteaMeetupManager.sol";

contract ProteaMeetup is GroupAdmin, ERC223Receiver {
    ProteaToken internal token;
    ProteaMeetupManager internal dataRegistry;

    // TODO: Could save gas changing to private on some
    string internal name;
    uint256 internal deposit;
    uint internal limitOfParticipants;
    uint internal endedAt;
    uint internal coolingPeriod;
    uint256 internal payoutAmount;
    string internal encryption;

    // Possibly not needed, depends on gas
    uint internal registered;
    uint internal attended;

    // // For keeping track of the deposits made to the events account
    mapping(address => uint) public deposited;

    struct TKN {
        address sender;
        uint value;
        bytes data;
        bytes4 sig;
    }

    // Need to audit event costs
    event RegisterEvent(address indexed _user, address indexed _event);
    event AttendEvent(address indexed _user, address indexed _event);
    event CancelEvent();
    event ClearEvent(address addr, uint256 leftOver);


    /* Modifiers */
    modifier onlyActive {
        require(dataRegistry.getEventState(address(this)) == 0, "Event not active");
        _;
    }

    modifier onlyEnded {
        // All states above 0 currently are an ended state
        require(dataRegistry.getEventState(address(this)) > 0, "Event has not ended");
        _;
    }

    modifier onlyToken {
        require(msg.sender == address(token), "Invalid token");
        _;
    }
    
    modifier spaceAvailable{
        require(registered < limitOfParticipants, "No RSVP slots available");
        _;
    }

    /* Public functions */

    constructor(
        string _name, 
        uint256 _deposit, 
        uint _limitOfParticipants, 
        uint _coolingPeriod, 
        address _tokenAddress, 
        string _encryption
        ) public {
        token = ProteaToken(_tokenAddress);
        dataRegistry = ProteaMeetupManager(_tokenAddress);
        if (bytes(_name).length != 0) {
            name = _name;
        } else {
            name = "Protea Meetup";
        }

        if (_deposit != 0) {
            deposit = _deposit;
        } else {
            deposit = 200;
        }

        if (_limitOfParticipants != 0) {
            limitOfParticipants = _limitOfParticipants;
        } else {
            limitOfParticipants = 20;
    
        }

        if (_coolingPeriod != 0) {
            coolingPeriod = _coolingPeriod;
        } else {
            coolingPeriod = 1 weeks;
        }

        if (bytes(_encryption).length != 0) {
            encryption = _encryption;
        }
    }

    function registerInternal(address _from, uint _value) internal onlyActive spaceAvailable {
        // Leaving ability to add more as a donation option, not directly exposed in UI
        require(_value >= deposit, "Insufficient funds");
        require(!isRegistered(_from), "User already registered");
        deposited[_from] += _value;

        dataRegistry.registerAttendee(_from, "");

        emit RegisterEvent(_from, address(this));
    }

    function withdraw() external onlyEnded {
        require(payoutAmount > 0, "No available payout");
        require(
            dataRegistry.getEventState(address(this)) == 2 || 
            dataRegistry.getAttendeeState(address(this), msg.sender) == 2
            ,"Event not cancelled or User not attended"
        );
        dataRegistry.confirmPaid(msg.sender);
        returnToken(payoutAmount);
    }

    // /* Views */
    function totalBalance() public view returns(uint256) {
        return token.balanceOf(this);
    }

    function isRegistered(address _addr) public view returns(bool) {
        return dataRegistry.getAttendeeState(address(this), _addr) > 0;
    }

    function isAttended(address _addr) public view returns(bool) {
        return dataRegistry.getAttendeeState(address(this), _addr) == 2;
    }

    function isPaid(address _addr) public view returns(bool) {
        return dataRegistry.getAttendeeState(address(this), _addr) == 3;
    }

    function payout() public view returns(uint256) {
        if (attended == 0) return 0;
        return uint(totalBalance()) / uint(attended);
    }

    // /* Admin only functions */

    function endEvent() external onlyOwner onlyActive {
        payoutAmount = payout();
        dataRegistry.setEventState(1);
        endedAt = now; // solium-disable-line security/no-block-members
    }

    function cancel() external onlyOwner onlyActive {
        payoutAmount = deposit;
        dataRegistry.setEventState(3);
        endedAt = now; // solium-disable-line security/no-block-members
        emit CancelEvent();
    }

    /*  */
    /**
     * @dev Return the remaining of balance if there are any unclaimed after cooling period   
     */
    function clear() external onlyOwner onlyEnded {
        require(now > endedAt + coolingPeriod, "Cool down incomplete");  // solium-disable-line security/no-block-members
        require(dataRegistry.getEventState(address(this)) > 1, "Event still active");
        uint leftOver = totalBalance();
        token.transfer(owner, leftOver);
        emit ClearEvent(owner, leftOver);
    }

    // Need to add checks in here
    function setLimitOfParticipants(uint _limitOfParticipants) external onlyOwner onlyActive {
        limitOfParticipants = _limitOfParticipants;
    }

    function attend(address[] _addresses) public onlyAdmin onlyActive {
        for (uint i = 0; i < _addresses.length; i++) {
            address _addr = _addresses[i];
            require(isRegistered(_addr), "Account not registered");
            require(!isAttended(_addr), "Account is already attending");
            emit AttendEvent(_addr, address(this));
            dataRegistry.confirmAttendee(_addr);
            attended++;
        }
    }

    function returnToken(uint _amount) internal returns(bool success) {
        token.returnToken(msg.sender, _amount, deposit);
        success = true;
    }

    // ERC223 compliance
    function tokenFallback(address _from, uint _value, bytes _data) external onlyToken {
        registerInternal(_from, _value);
    }

}