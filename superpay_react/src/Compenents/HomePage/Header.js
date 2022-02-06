import React, { Component } from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';



class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: this.props.activeStep,
            address: this.props.address,
            walletConnected: this.props.walletConnected
        }
        this.UNSAFE_componentWillReceiveProps = this.UNSAFE_componentWillReceiveProps.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.activeStep !== nextProps.activeStep) {
            this.setState({
                activeStep: nextProps.activeStep,
                wallet: nextProps.wallet,
                walletConnected: nextProps.walletConnected
            })
        }
    }

    render() {
        return (
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            Superpay
                        </Typography>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <Typography>
                                    {this.state.walletConnected ? this.state.address.substring(0, 7) + '...' : ''}
                                </Typography>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar >
        )
    }

}

export default Header;