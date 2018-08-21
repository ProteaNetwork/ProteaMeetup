pragma solidity 0.4.24;

// For remix testing

contract ERC20Basic {
    function totalSupply() public view returns (uint256);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract ERC20 is ERC20Basic {
    function allowance(address owner, address spender) public view returns (uint256);
    function transferFrom(address from, address to, uint256 value) public returns (bool);
    function approve(address spender, uint256 value) public returns (bool);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Ownable {
    address public owner;


    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }


    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }


    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

} 

contract Destructible is Ownable {

    constructor() public payable {}

    /**
     * @dev Transfers the current balance to the owner and terminates the contract.
     */
    function destroy() onlyOwner public {
        selfdestruct(owner);
    }
  
    function destroyAndSend(address _recipient) onlyOwner public {
        selfdestruct(_recipient);
    }
}

contract ERC223 is ERC20 {
    function transfer(address to, uint value, bytes data) public;
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
}

interface ERC223Receiver { 
    function tokenFallback(address _from, uint _value, bytes _data) external;
}

contract GroupAdmin is Ownable {
    event AdminGranted(address indexed grantee);
    event AdminRevoked(address indexed grantee);
    address[] public admins;

    modifier onlyAdmin() {
        require(isAdmin(msg.sender));
        _;
    }

    function grant(address[] newAdmins) public onlyOwner {
        for (uint i = 0; i < newAdmins.length; i++) {
            admins.push(newAdmins[i]);
            emit AdminGranted(newAdmins[i]);
        }
    }

    function revoke(address[] oldAdmins) public onlyOwner {
        for (uint i = 0; i < oldAdmins.length; i++) {
            for (uint j = 0; j < admins.length; ++i) {
                if (admins[j] == oldAdmins[i]) {
                    admins[j] = admins[admins.length - 1];
                    admins.length--;
                    emit AdminRevoked(oldAdmins[i]);
                    break;
                }
            }
        }
    }

    function getAdmins() view public returns(address[]) {
        address[] memory adminsList = new address[](admins.length + 1);
        for (uint i = 0; i < admins.length; i++) {
            adminsList[i] = admins[i];
        }
        adminsList[admins.length] = owner;
        return adminsList;
    }

    function numOfAdmins() view public returns(uint) {
        return admins.length;
    }


    function isAdmin(address admin) public view returns(bool) {
        if (admin == owner) return true;
        for (uint i = 0; i < admins.length; i++) {
            if (admins[i] == admin) {
                return true;
            }
        }
        return false;
    }
}   


contract ProteaMeetup is Destructible, GroupAdmin, ERC223Receiver {
    ERC223 internal token;

    // TODO: Could save gas changing to private on some
    string public name;
    uint256 public deposit;
    uint public limitOfParticipants;
    uint public registered;
    uint public attended;
    bool public ended;
    bool public cancelled;
    uint public endedAt;
    uint public coolingPeriod;
    uint256 public payoutAmount;
    string public encryption;

    mapping(address => Participant) public participants;
    mapping(uint => address) public participantsIndex;

    // // For keeping track of the deposits made to the events account
    mapping(address => uint) public deposited;

    struct Participant {
        address addr;
        address identity;
        bool attended;
        bool paid;
    }

    struct TKN {
        address sender;
        uint value;
        bytes data;
        bytes4 sig;
    }

    event RegisterEvent(address addr);
    event AttendEvent(address addr);
    event PaybackEvent(uint256 _payout);
    event WithdrawEvent(address addr, uint256 _payout);
    event CancelEvent();
    event ClearEvent(address addr, uint256 leftOver);

    // Token

    /* Modifiers */
    modifier onlyActive {
        require(!ended);
        _;
    }

    modifier onlyEnded {
        require(ended);
        _;
    }

    modifier onlyToken {
        require(msg.sender == address(token));
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
        token = ERC223(_tokenAddress);
        if (bytes(_name).length != 0) {
            name = _name;
        } else {
            name = "Test";
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

    function registerInternal(address _from, uint _value) internal onlyActive {
        require(_value >= deposit);
        require(registered < limitOfParticipants);
        require(!isRegistered(_from));
        deposited[_from] += _value;
        registered++;
        participantsIndex[registered] = _from;
        // Leaving Identity field open for Proof of Attendance
        participants[_from] = Participant(_from, address(0), false, false);
        emit RegisterEvent(_from);
    }

    function withdraw() external onlyEnded {
        require(payoutAmount > 0);
        Participant storage participant = participants[msg.sender];
        require(participant.addr == msg.sender);
        require(cancelled || participant.attended);
        require(participant.paid == false);

        participant.paid = true;
        transfer(payoutAmount);
        emit WithdrawEvent(msg.sender, payoutAmount);
    }

    // /* Views */
    function totalBalance() view public returns(uint256) {
        return token.balanceOf(this);
    }

    function isRegistered(address _addr) view public returns(bool) {
        return participants[_addr].addr != address(0);
    }

    function isAttended(address _addr) view public returns(bool) {
        return isRegistered(_addr) && participants[_addr].attended;
    }

    function isPaid(address _addr) view public returns(bool) {
        return isRegistered(_addr) && participants[_addr].paid;
    }

    function payout() view public returns(uint256) {
        if (attended == 0) return 0;
        return uint(totalBalance()) / uint(attended);
    }

    // /* Admin only functions */

    function payback() external onlyOwner onlyActive {
        payoutAmount = payout();
        ended = true;
        endedAt = now;
        emit PaybackEvent(payoutAmount);
    }

    function cancel() external onlyOwner onlyActive {
        payoutAmount = deposit;
        cancelled = true;
        ended = true;
        endedAt = now;
        emit CancelEvent();
    }

    /* return the remaining of balance if there are any unclaimed after cooling period */
    function clear() external onlyOwner onlyEnded {
        require(now > endedAt + coolingPeriod);
        require(ended);
        uint leftOver = totalBalance();
        transfer(leftOver);
        emit ClearEvent(owner, leftOver);
    }

    // Need to add checks in here
    function setLimitOfParticipants(uint _limitOfParticipants) external onlyOwner onlyActive {
        limitOfParticipants = _limitOfParticipants;
    }

    function attend(address[] _addresses) public onlyAdmin onlyActive {
        for (uint i = 0; i < _addresses.length; i++) {
            address _addr = _addresses[i];
            require(isRegistered(_addr));
            require(!isAttended(_addr));
            emit AttendEvent(_addr);
            participants[_addr].attended = true;
            attended++;
            // Identity rewards functions could happen here

        }
    }

    function transfer(uint _amount) internal returns(bool) {
        return token.transfer(msg.sender, _amount);
    }

    // ERC223 compliance
    function tokenFallback(address _from, uint _value, bytes _data) external {
        require(msg.sender == address(token));

        registerInternal(_from, _value);

    }
}