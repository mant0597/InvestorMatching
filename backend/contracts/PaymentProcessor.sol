// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentProcessor {
    event FundsReleased(address indexed investor, address indexed startup, uint256 amount);

    function releaseFunds(address payable _startup) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_startup != address(0), "Invalid startup address");

        _startup.transfer(msg.value);
        emit FundsReleased(msg.sender, _startup, msg.value);
    }
}
