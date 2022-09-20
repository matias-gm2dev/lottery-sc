// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Lottery {
    address payable public manager;
    address[] public players;

    constructor() {
        manager = payable(msg.sender);
    }

    function enter() public payable onlyUnregistered {
        require(msg.value >= 10000000000000000, "The min bet is 0.01 ETH");
        players.push(msg.sender);
    }

    function chooseWinner() public view returns (address) {
        require(msg.sender == manager, "You are not the manager");
        require(players.length > 0, "There are not players");
        uint index = random() % players.length;
        return players[index];
    }

    function checkIfAddressIsInLottery(address addr)
        public
        view
        returns (bool)
    {
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == addr) return true;
        }
        return false;
    }

    function random() private view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encode(block.difficulty, block.timestamp, players)
                )
            );
    }

    modifier onlyUnregistered() {
        require(
            !checkIfAddressIsInLottery(msg.sender),
            "You are alredy registered"
        );
        _;
    }
}
