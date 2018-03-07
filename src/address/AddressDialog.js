/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import config, {constant} from '../config/default';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import AddressList from './AddressList';
import AddressView from './AddressView';

function Transition(props) {
  return <Slide direction="right" {...props} />;
}


const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

class AddressDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            user: null
        };
        this.openDialog = this.openDialog.bind(this);
        this.props.openDialog(this.openDialog);
    }    
  openDialog = () => {
    console.log('AddressDialog Open'); 
    this.setState({ open: true });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  
  render() {
    const { classes } = this.props;
    return (
        <Dialog fullScreen  open={this.state.open} onRequestClose={this.handleRequestClose} transition={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>{constant.addressBookLabel}</Typography>           
                </Toolbar>
            </AppBar>
            <AddressList/>
            <AddressView/>
        </Dialog>);
  }
}

AddressDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddressDialog);


