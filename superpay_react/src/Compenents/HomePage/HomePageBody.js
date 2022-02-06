import React, { Component } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ethers } from "ethers"
import { Framework } from "@superfluid-finance/sdk-core"
import Tooltip from '@mui/material/Tooltip';
import Company from '../../artifacts/contracts/Company.sol/Company.json';


class HomePageBody extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStep: this.props.activeStep,
            address: this.props.address,
            walletConnected: this.props.walletConnected,
            flowRate: this.props.flowRate,
            streamAddress: null,
            superfluidAddress: "0xCeba7CC9b04696E0Da583Ac1d59C59e6564F9a7B",
            copiedAddress: false,
            companyAddress: "",
            succesfulContractUpdate: false,
            yearlySalary: 0,
            verificationError: false,
            verificationErrorMessage: ""
        }
        this.UNSAFE_componentWillReceiveProps = this.UNSAFE_componentWillReceiveProps.bind(this)
        this.startStream = this.startStream.bind(this)
        this.updateCompanyAddress = this.updateCompanyAddress.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.activeStep !== nextProps.activeStep) {
            this.setState({
                activeStep: nextProps.activeStep,
                address: nextProps.address,
                walletConnected: nextProps.walletConnected,
                flowRate: nextProps.flowRate
            })
        }
    }

    updateCompanyAddress(event) {
        var companyAddress = event.target.value;

        this.setState({
            companyAddress: companyAddress
        });
    }

    verifyPayrollContract = async () => {
        this.setState({
            verificationError: false
        })

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(this.state.companyAddress, Company.abi, signer);

        try {
            const employeeAddress = await contract.salaryAmt(this.state.address);
            if (employeeAddress.toNumber() === 0) {
                console.log("Employee address is not in the Company's smart contract!");
                this.setState({
                    verificationError: true,
                    verificationErrorMessage: "Employee address is not in the Company's smart contract!"
                })
                return;
            } else {
                const yearlySalary = await contract.salaryAmt(this.state.address);
                const secondsInYear = 31536000;
                const etherInUsd = 3000;
                const newFlowRate = 10 ** 18 * yearlySalary / (etherInUsd * secondsInYear); // Converts USD/yr to Wei/sec
                // this.setstate flowrate
                this.setState({
                    flowRate: newFlowRate,
                    yearlySalary: yearlySalary
                })
            }
        } catch (e) {
            console.error(e);
        }
    }

    changeEmployeeAddress = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(this.state.companyAddress, Company.abi, signer);

        try {
            await contract.changeEmployeeAddress(this.state.superfluidAddress);
            console.log('Updating Company Contract')
            this.setState({
                succesfulContractUpdate: true
            })
        } catch (e) {
            console.error(e);
        }
    }

    startStream = async () => {
        this.changeEmployeeAddress();

        const provider = new ethers.providers.JsonRpcProvider("https://eth-kovan.alchemyapi.io/v2/nl2PDNZm065-H3wMj2z1_mvGP81bLfqX");
        console.log(provider)

        const sf = await Framework.create({
            networkName: "kovan",
            provider: provider
        });
        console.log(sf)

        const signer = sf.createSigner({
            privateKey:
                "0xd2ebfb1517ee73c4bd3d209530a7e1c25352542843077109ae77a2c0213375f1",
            provider: provider
        });

        const DAIx = "0xe3cb950cb164a31c66e32c320a800d477019dcff";

        try {
            const createFlowOperation = sf.cfaV1.createFlow({
                flowRate: this.state.flowRate,
                receiver: this.state.address,
                superToken: DAIx
            });

            console.log("Creating your stream...");

            const result = createFlowOperation.exec(signer);
            console.log(result);

            console.log(
                `Congrats - you've just created a money stream!
              View Your Stream At: https://app.superfluid.finance/dashboard/${this.state.address}
              Network: Kovan
              Super Token: DAIx
              Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
              Receiver: ${this.state.address},
              FlowRate: ${this.state.flowRate}
              `
            );
            this.setState({
                streamAddress: "https://app.superfluid.finance/dashboard/${this.state.address}",
                activeStep: this.state.activeStep + 1
            })
        } catch (error) {
            console.log(
                "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
            );
            console.error(error);
        }
    }

    copyAddress = () => {
        navigator.clipboard.writeText(this.state.superfluidAddress)
        this.setState({
            copiedAddress: true
        })
    }

    render() {

        if (this.state.activeStep === 0 & !this.state.walletConnected) {
            return (
                <CardContent>
                    <h1>Step 1</h1>
                    <p>Connect your wallet.</p>
                    <Button onClick={() => this.props.connectWallet()} variant="contained">Connect Wallet</Button>
                </CardContent>
            )
        }
        if (this.state.activeStep === 0 & this.state.walletConnected) {
            return (
                <CardContent>
                    <h1>Step 1</h1>
                    <h2>Wallet address {this.state.address.substring(0, 7)}... is currently connected.</h2>
                </CardContent>
            )
        }
        if (this.state.activeStep === 1 & !this.state.succesfulContractUpdate & !this.state.verificationError) {
            return (
                <CardContent>
                    <h1>Step 2</h1>
                    <h2>Input the payroll contract for verification.</h2>
                    <div>
                        <TextField label="Contract Address" variant="filled" onChange={this.updateCompanyAddress} />
                    </div>
                    <div>
                        <Button variant="contained" onClick={() => this.verifyPayrollContract()}>Verify</Button>
                    </div>
                </CardContent>
            )
        }
        if (this.state.activeStep === 1 & this.state.succesfulContractUpdate) {
            return (
                <CardContent>
                    <h1>Step 2</h1>
                    <h2>Contract {this.state.companyAddress} succesfully verified.</h2>
                </CardContent>
            )
        }
        if (this.state.activeStep === 1 & this.state.verificationError) {
            return (
                <CardContent>
                    <h1>Step 2</h1>
                    <h2>{this.state.verificationErrorMessage}</h2>
                    <h3>Please resolve the error and try again.</h3>
                    <div>
                        <TextField label="Contract Address" variant="filled" onChange={this.updateCompanyAddress} />
                    </div>
                    <div>
                        <Button variant="contained" onClick={() => this.verifyPayrollContract()}>Verify</Button>
                    </div>
                </CardContent>
            )
        }

        if (this.state.activeStep === 2) {
            return (
                <CardContent>
                    <h1>Step 3</h1>
                    <h2>Confirm the details and begin stream.</h2>
                    <h3>Pay to: {this.state.address}</h3>
                    <h3>Annual Salary: ${this.state.yearlySalary} / year</h3>
                    <Button variant="contained"
                        onClick={() => this.startStream()}>
                        Start Stream</Button>
                </CardContent>
            )
        }
        if (this.state.activeStep === 3 & this.state.streamAddress !== null) {
            console.log(this.state.streamAddress)
            return (
                <CardContent>
                    <h1>Stream Activated!</h1>
                    <Button href={this.state.streamAddress} target="_blank">See your stream live on Superfluid</Button>
                </CardContent>
            )
        }
    }
}

export default HomePageBody;