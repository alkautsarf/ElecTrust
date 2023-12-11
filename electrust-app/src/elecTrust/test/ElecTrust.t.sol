// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {ElecTrust} from "../src/ElecTrust.sol";
import {ElecTrustV2} from "../src/ElecTrust.sol";
import {ElecTrustV4} from "../src/ElecTrust.sol";
import "forge-std/console.sol";

contract ElecTrustTest is Test {
    ElecTrust public elecTrust;

    function setUp() public {
        elecTrust = new ElecTrust();
    }

    function test_getVote() public {
        (uint256 vote1, uint256 vote2, uint256 vote3) = elecTrust.getVote();
        assertEq(vote1, 0, "Failed getting vote for candidate 1");
        assertEq(vote2, 0, "Failed getting vote for candidate 2");
        assertEq(vote3, 0, "Failed getting vote for candidate 3");
    }

    function test_vote() public {
        elecTrust.setVote(1);
        (uint256 vote1,,) = elecTrust.getVote();
        assertEq(vote1, 1, "Failed getting vote for candidate 1");
    }

    function test_voteFailed(uint256 _candidate) public {
        vm.assume(_candidate > 0 && _candidate < 4);
        elecTrust.setVote(1);
        vm.expectRevert("Already Voted");
        elecTrust.setVote(_candidate);
    }

    function invariant_votes_always_above_zero() public view {
        (uint256 vote1, uint256 vote2, uint256 vote3) = elecTrust.getVote();
        assert(vote1 >= 0);
        assert(vote2 >= 0);
        assert(vote3 >= 0);
    }
}

contract ElecTrustV2Test is Test {
    ElecTrustV2 public elecTrust;
    uint256 number = 2;
    string name = "candidate";

    function setUp() public {
        elecTrust = new ElecTrustV2("TestingVote", number);
    }

    function testVoteName() public {
        assertEq(elecTrust.getName(), "TestingVote", "Name doesn't match");
    }

    function testGetterName() public view {
        elecTrust.getName();
    }

    function testTotalCandidates() public {
        assertEq(elecTrust.totalCandidates(), number, "Failed getting total candidates");
    }

    function testCandidateName() public {
        for (uint256 i = 1; i <= number; i++) {
            elecTrust.setCandidateName(i, name);
        }
        for (uint256 i = 1; i <= number; i++) {
            assertEq(elecTrust.getCandidateName(i), name, "Failed getting candidate name");
        }
    }

    function testVote() public {
        uint256 vote = elecTrust.getVotes(1);
        elecTrust.vote(1);
        assertEq(elecTrust.hasVoted(address(this)), true);
        assertEq(elecTrust.getVotes(1), vote + 1, "Failed getting vote for candidate 1");
    }

    function test_voteFailedOnlyOnce() public {
        elecTrust.vote(1);
        vm.expectRevert("You have already voted");
        elecTrust.vote(2);
    }

    function test_voteFailedCandidateUnavailable() public {
        vm.expectRevert("Invalid candidate index");
        elecTrust.vote(3);
    }

    function testFailedSetCandidateNameEmpty() public {
        elecTrust.setCandidateName(0, "");
    }

    function testFailedDeployWithEmptyString() public {
        ElecTrustV2 _elecTrust;
        _elecTrust = new ElecTrustV2("", 0);
    }
}

contract ElecTrustV4Test is Test {
    ElecTrustV4 public elecTrust;
    uint256 private _number = 3;
    string private _electionName = "TestingVote";

    function setUp() public {
        elecTrust = new ElecTrustV4();
        elecTrust.setElection(_electionName, _number, 1);
    }

    function testVoteName() public {
        assertEq(elecTrust.electionName(), "TestingVote", "Name doesn't match");
    }

    function testTotalCandidates() public {
        assertEq(elecTrust.totalCandidates(), _number, "Failed getting total candidates");
    }

    function testCandidateName(string memory _name) public {
        bytes memory _bytesName = bytes(_name);
        vm.assume(_bytesName.length != 0);

        for (uint256 i = 1; i <= _number; i++) {
            elecTrust.setCandidateName(i, _name);
        }

        for (uint256 i = 1; i <= _number; i++) {
            assertEq(elecTrust.getCandidateName(i), _name, "Failed getting candidate name");
        }
    }

    function testVote(string memory _name) public {
        bytes memory _bytesName = bytes(_name);
        vm.assume(_bytesName.length != 0);
        for (uint256 i = 1; i <= _number; i++) {
            elecTrust.setCandidateName(i, _name);
        }
        uint256 vote = elecTrust.getVotes(1);
        elecTrust.vote(1);
        assertEq(elecTrust.hasVoted(address(this)), true);
        assertEq(elecTrust.getVotes(1), vote + 1, "Failed getting vote for candidate 1");
    }

    function testVoteFailedExpired(string memory _name) public {
        bytes memory _bytesName = bytes(_name);
        vm.assume(_bytesName.length != 0);
        for (uint256 i = 1; i <= _number; i++) {
            elecTrust.setCandidateName(i, _name);
        }
        skip(86400);
        vm.expectRevert("Voting has expired");
        elecTrust.vote(1);
    }

    function test_voteFailedOnlyOnce() public {
        elecTrust.vote(1);
        vm.expectRevert("You have already voted");
        elecTrust.vote(2);
    }

    function test_voteFailedCandidateUnavailable() public {
        vm.expectRevert("Invalid candidate index");
        elecTrust.vote(4);
    }

    function testFailedSetCandidateNameEmpty() public {
        elecTrust.setCandidateName(0, "");
    }
}
