// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;
pragma experimental ABIEncoderV2;


interface IRarities {

    struct Rarity {
        string name;
        uint256 maxSupply;
        uint256 price;
    }

    function getRarityByName(string calldata rarity) external view returns (Rarity memory);
}