// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {ElecTrust} from "../src/ElecTrust.sol";

contract ElecTrustTest is Test {
    ElecTrust public elecTrust;

    function setUp() public {
        elecTrust = new ElecTrust();
    }
}
