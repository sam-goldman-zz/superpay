import React, { Component } from 'react';
import Navigation from './Navigation.js'
import HomePageBody from './HomePageBody.js';
import Card from '@mui/material/Card';
import NavButtons from './NavButtons.js';
import Header from './Header.js'

class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
            walletConnected: false,
            address: null,
            flowRate: '1000000000000000000'
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
                            height: '25vw'
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
            </div >
        )
    }
}

export default HomePage;