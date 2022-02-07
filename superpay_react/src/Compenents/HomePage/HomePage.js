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
import CardContent from '@mui/material/CardContent';



class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            activeStep: 0,
        }
    }

    nextStep = () => {
        this.setState({
            activeStep: this.state.activeStep + 1
        })

    }

    prevStep = () => {
        this.setState({
            activeStep: this.state.activeStep - 1
        })
    }

    finish = () => {
        this.setState({
            activeStep: this.state.activeStep + 1
        })
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
                    <Header />
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