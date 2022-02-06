import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const steps = ['Reroute Salary', 'Verify Payroll', 'Connect Wallet', 'Start Stream']

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStep: this.props.activeStep
        }
        this.UNSAFE_componentWillReceiveProps = this.UNSAFE_componentWillReceiveProps.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.activeStep !== nextProps.activeStep) {
            this.setState({
                activeStep: nextProps.activeStep
            })
        }
    }

    render() {
        return (
            <div className="NavigationDiv">
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={this.state.activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={label}
                                    activeStep={this.state.activeStep}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </Box>
            </div>
        )
    }
}

export default Navigation;