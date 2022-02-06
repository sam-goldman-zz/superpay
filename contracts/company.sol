pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Company is Ownable {

    using SafeMath for uint;
    using SafeERC20 for IERC20;

    address public paymentToken;

    // Amount of times an employee gets paid a year
    mapping(address=>uint) public salaryFreq;
    //Amount that an employee gets paid each year
    mapping(address=>uint) public salaryAmt;

    function ChangePaymentToken(address _token) external onlyOwner {
        paymentToken = _token;
    }

    function SalaryFrequence(address _employee) public view returns (uint) {
        return salaryFreq[_employee];
    } 

    function SalaryAmount(address _employee) public view returns (uint) {
        return salaryAmt[_employee];
    } 

    function ChangeSalaryFrequence(address _employee, uint _freq) external onlyOwner {
        salaryFreq[_employee] = _freq;
    } 

    function ChangeSalaryAmount(address _employee, uint _amt) external onlyOwner {
        return salaryFreq[_employee] = _amt;
    } 

    function Deposit(address _token, uint _amount) external {
        require(_token==paymentToken, "Payment system can only accept USDC." );
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
    }

    function PayEmployee(address _employee) external onlyOwner {
        IERC20(_token).safeTransfer(paymentToken, _employee, ceilDiv(salaryAmt, salaryFreq));
    }

    function ChangeEmployeeAddress(address _former, address _new) external {
        require(msg.sender==_former || msg.sender==owner(), 
            'Only employer or specific employee can change their payment location.');
        salaryFreq[_new] = salaryFreq[_former];
        salaryAmt[_new] = salaryAmt[_former]; 
        delete salaryFreq[_former];
        delete salaryAmt[_former];
    }

    function FireEmployee(address _employee) external onlyOwner {
        delete salaryFreq[_employee];
        delete salaryAmt[_employee];
    }
}