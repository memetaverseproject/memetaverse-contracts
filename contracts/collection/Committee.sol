// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "../interfaces/ICollectionManager.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../common/NativeMetaTransaction.sol";


contract Committee is Ownable, NativeMetaTransaction {

    mapping(address => bool) public members;

    event MemberSet(address indexed _member, bool _value);

    /**
    * @notice Create the contract
    * @param _owner - owner of the contract
    * @param _members - members to be added at contract creation
    */
    constructor(address _owner, address[] memory _members) NativeMetaTransaction("Memetaverse Collection Committee","1"){
        transferOwnership(_owner);

        for (uint256 i = 0; i < _members.length; i++) {
            _setMember(_members[i], true);
        }
    }

    /**
    * @notice Set members
    * @param _members - members to be added
    * @param _values - whether the members should be added or removed
    */
    function setMembers(address[] calldata _members, bool[] calldata _values) external onlyOwner {
        require(_members.length == _values.length, "Committee#setMembers: LENGTH_MISMATCH");

        for (uint256 i = 0; i < _members.length; i++) {
            _setMember(_members[i], _values[i]);
        }
    }

    /**
    * @notice Set members
    * @param _member - member to be added
    * @param _value - whether the member should be added or removed
    */
    function _setMember(address _member, bool _value) internal {
        members[_member] = _value;

        emit MemberSet(_member, _value);
    }

    /**
    * @notice Manage collection
    * @param _collectionManager - collection manager
    * @param _forwarder - forwarder contract owner of the collection
    * @param _collection - collection to be managed
    * @param _data - array of calls
    */
    function manageCollection(ICollectionManager _collectionManager, address _forwarder, address _collection, bytes[] memory _data) external {
       require(members[_msgSender()], "Committee#manageCollection: UNAUTHORIZED_SENDER");

        for (uint256 i = 0; i < _data.length; i++) {
            _collectionManager.manageCollection(_forwarder, _collection, _data[i]);
        }
    }
}