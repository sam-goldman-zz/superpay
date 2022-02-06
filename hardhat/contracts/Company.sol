// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Company is Ownable {

    using Math for uint;
    using SafeERC20 for IERC20;

    event stopPaying(address _employee, address _payrollLocation);

    address public paymentToken;
    // Amount of times an employee gets paid a year
    uint public salaryFreq;
    //Amount that an employee gets paid each year
    mapping(address=>uint) public salaryAmt;
    mapping(address=>bool) public employed;
    mapping(address=>address) public payrollAddress;

    function changePaymentToken(address _token) external onlyOwner {
        paymentToken = _token;
    }

    function changePayrollFreq(uint _freq) external onlyOwner {
        salaryFreq = _freq;
    }

    function newEmployee(address _employee, uint _amt) external onlyOwner {
        salaryAmt[_employee] = _amt;
        employed[_employee] = true;
        payrollAddress[_employee] = _employee;
    } 

    function changeAmt(address _employee, uint _amt) external onlyOwner {
        require(employed[_employee], 'Must be employed by the company.');
        salaryAmt[_employee] = _amt;
    } 

    function deposit(address _token, uint _amount) external {
        require(_token==paymentToken, "Payroll can only accept the official payment token." );
        IERC20(paymentToken).safeTransferFrom(msg.sender, address(this), _amount);
    }

    function payEmployee(address _employee) external onlyOwner {
        IERC20(paymentToken).safeTransfer(payrollAddress[_employee], Math.ceilDiv(salaryAmt[_employee], salaryFreq));
    }

    function changeEmployeeAddress(address _new) external {
        require(payrollAddress[msg.sender]!=address(0x0000000000000000000000000000000000000000), 
            "Can't change payroll address if that employee doesn't have a payroll address.");
        emit stopPaying(msg.sender, payrollAddress[msg.sender]);
        payrollAddress[msg.sender] = _new;
    }

    function fireEmployee(address _employee) external onlyOwner {
        require(employed[_employee], 'Must be employed by the company.');
        emit stopPaying(_employee, payrollAddress[_employee]);
        employed[_employee] = false;
        delete salaryAmt[_employee];
        delete payrollAddress[_employee];
    }
}