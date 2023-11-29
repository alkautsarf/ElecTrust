// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {ElecTrust} from "../src/ElecTrust.sol";
import "forge-std/console.sol";

contract ElecTrustTest is Test {
    ElecTrust public elecTrust;

    function setUp() public {
        elecTrust = new ElecTrust();
    }

    function testGetVote() public {
        (uint256 vote1, uint256 vote2, uint256 vote3) = elecTrust.getVote();
        assertEq(vote1, 0, "Failed getting vote for candidate 1");
        assertEq(vote2, 0, "Failed getting vote for candidate 2");
        assertEq(vote3, 0, "Failed getting vote for candidate 3");
    }

    function testVote() public {
        elecTrust.setVote(1);
        (uint256 vote1, , ) = elecTrust.getVote();
        assertEq(vote1, 1, "Failed getting vote for candidate 1");
    }
}
