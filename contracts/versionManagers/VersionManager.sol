pragma solidity ^0.4.21;

import "../utils/GroupAdmin.sol";

/**
 * @title A version manager for Protea iterations
 * @dev this allows new versions of Protea contracts to be managed
 */
contract VersionManager is GroupAdmin {
    string internal title;
    mapping(address => address[]) internal versions;

    constructor(string _title) {
        title = _title;
    }

    event NewVersionSet(address indexed _token, address indexed _factory);
    event VersionRemoved(address indexed _token, address indexed _factory);

    function setVersion(address _token, address _version) onlyAdmin public {
        versions[_token].push(_version);
        emit NewVersionSet(_token, _version);
    }

    function removeFactory(address _token, address _version) onlyAdmin public {
        delete versions[_token][_version];
        emit VersionRemoved(_token, _version);
    }

    function getVersions(address _token) view public returns(address) {
        return versions[_token];
    }
}