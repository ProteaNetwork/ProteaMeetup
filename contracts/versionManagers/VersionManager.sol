pragma solidity ^0.4.24;

import "../utils/GroupAdmin.sol";

/**
 * @title A version manager for Protea iterations
 * @dev this allows new versions of Protea contracts to be managed
 */
contract VersionManager is GroupAdmin {
    string internal title;
    mapping(address => address[]) internal versions;

    constructor(string _title) public {
        title = _title;
    }

    event NewVersionSet(address indexed _token, address indexed _factory);
    event VersionRemoved(address indexed _token, address indexed _factory);

    function getName() view public returns(string name){
        name = title;
    }

    function setVersion(address _token, address _version) onlyAdmin public {
        versions[_token].push(_version);
        emit NewVersionSet(_token, _version);
    }

    function removeFactory(address _token, address _version) onlyAdmin public {
        address[] storage versionsArr = versions[_token];
        for(uint i = 0; i < versionsArr.length; i++) {
            if(versionsArr[i] == _version){
                delete versions[_token][i];
                break;
            }
        }
        emit VersionRemoved(_token, _version);
    }

    function getVersions(address _token) view public returns(address[]) {
        return versions[_token];
    }
}