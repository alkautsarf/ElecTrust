// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {ElecTrust} from "../src/ElecTrust.sol";


contract ElecTrustScript is Script {
    ElecTrust public elecTrust;
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        elecTrust = new ElecTrust();
        // elecTrust.setVote(1);
        vm.stopBroadcast();
    }
}
