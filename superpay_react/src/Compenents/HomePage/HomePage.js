import React, { Component } from 'react';
import Navigation from './Navigation.js'
import HomePageBody from './HomePageBody.js';
import Card from '@mui/material/Card';
import NavButtons from './NavButtons.js';
import Header from './Header.js'
import { ethers } from "ethers"
import { Framework } from "@superfluid-finance/sdk-core"
import Company from '../../artifacts/contracts/Company.sol/Company.json';
import Button from '@mui/material/Button';


class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
            walletConnected: false,
            address: null,
            flowRate: 0
        }
    }

    nextStep = () => {
        console.log("Calling Next Step")
        this.setState({
            activeStep: this.state.activeStep + 1
        })
        console.log(this.state.address)
        console.log(this.state.walletConnected)
    }

    prevStep = () => {
        console.log("Calling Prev Step")
        this.setState({
            activeStep: this.state.activeStep - 1
        })
    }

    finish = () => {
        console.log("Calling Finish")
        this.setState({
            activeStep: this.state.activeStep + 1
        })
    }

    handleWalletBtnClick = async () => {
        console.log('Wallet')
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.setState({
                address: accounts[0]
            })
        } catch (e) {
            console.error("Error when requesting user's MetaMask account", e);
        }
    }

    componentDidMount() {
        try {
            const account = window.ethereum.selectedAddress
            let wallet_connected = (account !== null)
            this.setState({
                address: account,
                walletConnected: wallet_connected
            })
            console.log(account)
        } catch (e) {
            console.error("Error when requesting user's MetaMask account", e);
        }
    }

    resetPayrollContract = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract('0x3DF55F531E875bbDe9808e841D9dba975cE34f64', Company.abi, signer);

        try {
            await contract.changeEmployeeAddress(this.state.address);
            console.log('Updating Company Contract')
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        return (
            <div className="HomePage">
                <div className="Header">
                    <Header
                        walletConnected={this.state.walletConnected}
                        address={this.state.address} />
                </div>
                <div className="Navigation">
                    <Navigation
                        activeStep={this.state.activeStep}
                    />
                </div>
                <div className="HomePageBody">
                    <Card className="HomePageBodyCard"
                        style={{
                            height: '50vh'
                        }}>
                        <HomePageBody
                            activeStep={this.state.activeStep}
                            connectWallet={this.handleWalletBtnClick}
                            address={this.state.address}
                            walletConnected={this.state.walletConnected}
                            flowRate={this.state.flowRate}
                        />
                    </Card>
                </div>
                <div>

                    <NavButtons className="NavButtons"
                        activeStep={this.state.activeStep}
                        onNext={this.nextStep}
                        onPrev={this.prevStep}
                        onFinish={this.finish}
                    />
                </div>
                <div style={{ position: 'absolute', bottom: 0 }}>
                    <Button variant='contained' color='error' onClick={() => this.resetPayrollContract()}>Reset Payroll Contract</Button>
                </div>
            </div >
        )
    }
}

export default HomePage;