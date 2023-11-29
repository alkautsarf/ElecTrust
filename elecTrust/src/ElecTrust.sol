// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ElecTrust is Ownable(msg.sender) {
    enum Vote {
        Candidate1,
        Candidate2,
        Candidate3
    }

    mapping(Vote => uint256) private _votes;
    mapping(address => bool) private _voted;

    /**
     * @dev Initialize votes from non-zero values to optimize gas cost.
     */
    constructor() {
        unchecked {
            _votes[Vote.Candidate1] = 1;
            _votes[Vote.Candidate2] = 1;
            _votes[Vote.Candidate3] = 1;
        }
    }

    function setVote(uint256 _vote) external {
        require(!_voted[msg.sender] && _vote > 0 && _vote < 4, "Already Voted");
        _voted[msg.sender] = true;

        unchecked {
            if (_vote == 1) {
                _votes[Vote.Candidate1]++;
            } else if (_vote == 2) {
                _votes[Vote.Candidate2]++;
            } else if (_vote == 3) {
                _votes[Vote.Candidate3]++;
            }
        }
    }

    function getVote() external view returns(uint256, uint256, uint256) {
        return (_votes[Vote.Candidate1] - 1, _votes[Vote.Candidate2] - 1, _votes[Vote.Candidate3] - 1);
    }
}
