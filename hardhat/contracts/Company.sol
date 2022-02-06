// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Company is Ownable {

    using Math for uint;
    using SafeERC20 for IERC20;

    address public paymentToken;

    // Amount of times an employee gets paid a year
    mapping(address=>uint) public salaryFreq;
    //Amount that an employee gets paid each year
    mapping(address=>uint) public salaryAmt;

    function changePaymentToken(address _token) external onlyOwner {
        paymentToken = _token;
    }

    function newEmployee(address _employee, uint _freq, uint _amt) external onlyOwner {
        salaryFreq[_employee] = _freq;
        salaryFreq[_employee] = _amt;
    } 

    function deposit(address _token, uint _amount) external {
        require(_token==paymentToken, "Payment system can only accept DAIx." );
        IERC20(paymentToken).safeTransferFrom(msg.sender, address(this), _amount);
    }

    function payEmployee(address _employee) external onlyOwner {
        IERC20(paymentToken).safeTransfer(_employee, Math.ceilDiv(salaryAmt[_employee], salaryFreq[_employee]));
    }

    function changeEmployeeAddress(address _former, address _new) external {
        require(msg.sender==_former || msg.sender==owner(), 
            'Only employer or specific employee can change their payment location.');
        salaryFreq[_new] = salaryFreq[_former];
        salaryAmt[_new] = salaryAmt[_former]; 
        delete salaryFreq[_former];
        delete salaryAmt[_former];
    }

    function fireEmployee(address _employee) external onlyOwner {
        delete salaryFreq[_employee];
        delete salaryAmt[_employee];
    }
}