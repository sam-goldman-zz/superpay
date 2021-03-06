import React, { Component } from 'react';
import Button from '@mui/material/Button';

class NavButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: this.props.activeStep
        };
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
        if (this.state.activeStep === 0) {
            return (
                <Button variant='contained' onClick={() => this.props.onNext()}>
                    Next
                </Button>
            )
        }
        if (this.state.activeStep > 0 & this.state.activeStep < 2) {
            return (
                <div>
                    <Button variant='contained' onClick={() => this.props.onPrev()}>
                        Back
                    </Button>
                    <Button variant='contained' onClick={() => this.props.onNext()}>
                        Next
                    </Button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <Button variant='contained' onClick={() => this.props.onPrev()}>
                        Back
                    </Button>
                </div>
            )
        }
    }
}

export default NavButtons;