pragma solidity ^0.4.24;

import "../utils/GroupAdmin.sol";

/**
 * @title A version manager for Protea iterations
 * @dev this allows new versions of Protea contracts to be managed
 */

contract VersionManager is GroupAdmin {
    string internal title; 
    mapping(address => address[]) internal versions;
    mapping(address => mapping(address => uint)) internal versionIndex;
 
    constructor(string _title) public {
        title = _title;
    }

    event NewVersionSet(address indexed _token, address indexed _factory);
    event VersionRemoved(address indexed _token, address indexed _factory);

    function getName() public view returns(string name) {
        name = title;
    }

    // Gas used: 72458
    function setVersion(address _token, address _version) public onlyAdmin  {
        versions[_token].push(_version);
        versionIndex[_token][_version] = versions[_token].length-1;
        emit NewVersionSet(_token, _version);
    }

    // Gas used: 35251
    function removeVersion(address _token, address _version) public onlyAdmin  {
        uint index = versionIndex[_token][_version];
        if (0 > index) return;

        if (versions[_token].length > 1) {
            versions[_token][index] = versions[_token][versions[_token].length-1];
            delete(versions[_token][versions[_token].length-1]); 
        }
        versions[_token].length--;
        emit VersionRemoved(_token, _version);
    }

    function getVersions(address _token) public view returns(address[]) {
        return versions[_token];
    }
}