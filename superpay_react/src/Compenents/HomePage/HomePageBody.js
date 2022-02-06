import React, { Component } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ethers } from "ethers"
import { Framework } from "@superfluid-finance/sdk-core"
import Tooltip from '@mui/material/Tooltip';


class HomePageBody extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStep: this.props.activeStep,
            address: this.props.address,
            walletConnected: this.props.walletConnected,
            flowRate: this.props.flowRate,
            streamAddress: null,
            superfluidAddress: "0xYEET69420",
            copiedAddress: false
        }
        this.UNSAFE_componentWillReceiveProps = this.UNSAFE_componentWillReceiveProps.bind(this)
        this.startStream = this.startStream.bind(this)
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

    startStream = async () => {
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

        if (this.state.activeStep === 0) {
            return (
                <CardContent>
                    <h1>Step 1</h1>
                    <h2>Contact your employer and reroute your salary to Superpay.</h2>
                    <Tooltip title={this.state.copiedAddress ? "Address copied to clipboard" : "Click to copy address"} placement="right">
                        <Button variant="contained" style={{ height: '10vh', width: '30vw', "font-size": '3vh' }} onClick={() => { this.copyAddress() }}>{this.state.superfluidAddress}</Button>
                    </Tooltip>
                </CardContent>
            )
        }
        if (this.state.activeStep === 1) {
            return (
                <CardContent>
                    <h1>Step 2</h1>
                    <h2>Input the payroll contract for verification.</h2>
                    <TextField label="Contract Address" variant="filled" />
                </CardContent>
            )
        }
        if (this.state.activeStep === 2 & !this.state.walletConnected) {
            return (
                <CardContent>
                    <h1>Step 3</h1>
                    <p>Connect your wallet.</p>
                    <Button onClick={() => this.props.connectWallet()} variant="contained">Connect Wallet</Button>
                </CardContent>
            )
        }
        if (this.state.activeStep === 2 & this.state.walletConnected) {
            return (
                <CardContent>
                    <h1>Step 3</h1>
                    <h2>Connect your wallet.</h2>
                    <p>Wallet with address {this.state.address} is currently connected.</p>
                </CardContent>
            )
        }
        if (this.state.activeStep === 3) {
            return (
                <CardContent>
                    <h1>Step 4</h1>
                    <h2>Confirm the details and begin stream.</h2>
                    <h3>Pay to: {this.state.address}</h3>
                    <h3>Flow Rate: {this.state.flowRate}</h3>
                    <Button variant="contained"
                        onClick={() => this.startStream()}>
                        Start Stream</Button>
                </CardContent>
            )
        }
        if (this.state.activeStep === 4 & this.state.streamAddress !== null) {
            console.log(this.state.streamAddress)
            return (
                <CardContent>
                    <h1>Stream Activated!</h1>
                    <Button href={this.state.streamAddress}>See your stream live on Superfluid</Button>
                </CardContent>
            )
        }
    }
}

export default HomePageBody;